import axios from 'axios';
import {SERVER_URL , RELAY_URL} from "./config.json"
import { userStore , sessionStore } from './stores'


async function login(uid,pwd) {
    let data = new FormData();
    data.append('uid', uid);
    data.append('password', pwd);

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL + '/user/login',
    headers: { 
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };

    try {
        let resp = await axios.request(config)
        userStore.setState({uid : uid , secret: resp.data["ClientSecret"]})
        console.log(resp.data)
        if(resp.data["InSession"]!="") {
            console.log("DESYNCING BY JOINING SESSION" , resp.data["InSession"] , resp.data["SessionKey"])
            joinSession(resp.data["InSession"],resp.data["SessionKey"])
            sessionStore.setState({sesID: resp.data["InSession"] , sesKey: resp.data["SessionKey"]})
        }
        return resp.data
    }
    catch(e) {
        console.log("ERROR ON LOGIN" , uid,pwd , e.message)
        return null
    }
}

async function register(username,password) {
    let data = new FormData();
    data.append('username', username);
    data.append('password', password);

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/user/create',
    headers: { 
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };


    try {
        let resp = await axios.request(config)
        userStore.setState({uid: resp.data["UID"] , secret: resp.data["ClientSecret"]})
        return resp.data
    }
    catch(e) {
        console.log(e)
        return null
    }
}

async function createSession(sesKey) {
    let uid = await userStore.getState().uid;
    let secret = await userStore.getState().secret;
    let data = new FormData();
    data.append('key', sesKey);

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/session',
    headers: { 
        'uid': uid, 
        'secret': secret, 
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };

    try {
        let resp = await axios.request(config)
        await sessionStore.setState({sesID: resp.data["SessionID"] , sesKey: sesKey})
        let newState = await sessionStore.getState()

        console.log("CREATESESSION RESPONSE" , newState, resp.data["SessionID"])
        return resp.data
    }
    catch(e) {
        console.log(e)
        return null
    }

}

async function joinSession(sesID , sesKey) {
    let data = new FormData();
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;
    data.append('key', sesKey);

    let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/session/join?sid='+sesID,
    headers: { 
        'uid': uid, 
        'secret': secret, 
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };

    try {
        let resp = await axios.request(config)
        await sessionStore.setState({sesID: sesID , sesKey: sesKey})
        console.log("JOIN SESSION RESPONSE" , resp.data)
        return resp.data
    }
    catch(e) {

        return null
    }
}



async function leaveSession() {
    let uid = await userStore.getState().uid;
    let secret = await userStore.getState().secret;
    
    let data = new FormData();
    let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/session/leave?sid=' + sessionStore.getState().sesID,
    headers: { 
        'uid': uid, 
        'secret': secret,
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };

    try {
        let resp = await axios.request(config)
        await sessionStore.setState({sesID: "" , sesKey: ""})
        return resp.data
    }
    catch(e) {
        console.log(e)
        return null
    }

}




async function sessionMetadata() {
    let sid = await sessionStore.getState().sesID;
    let uid = await userStore.getState().uid;
    let secret = await userStore.getState().secret;

 
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: SERVER_URL+'/session?sid=' + sid,
      headers: { 
        'uid': uid, 
        'secret': secret, 
        'Content-Type': 'multipart/form-data'
    }    };
    let resp = null    
    try {
        resp = await axios.request(config)
        return resp.data

    } catch(e) {
        console.log("SESSION METADATA" , e.message)
        return null
    }
}

async function requestCreate(targetuid , code, content) {
    let uid = await userStore.getState().uid;
    let secret = await userStore.getState().secret;
    let sid = await sessionStore.getState().sesID;

    let data = new FormData();
    data.append('to', targetuid);
    data.append('from', uid);
    data.append('code', code);
    data.append('content', content);

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/request?sid=' + sid,
    headers: { 
        'uid': uid, 
        'secret': secret, 
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };

    try {
        let resp = await axios.request(config)
        console.log("CREATED REQUEST" , resp.data)
        return resp.data

    }
    catch(e) {
        console.log("FAILED TO CREATE REQUEST")
        console.log(e)
        return null
    }
}



async function requestGet() {
    let sid = await sessionStore.getState().sesID;
    let uid = await userStore.getState().uid;
    let secret = await userStore.getState().secret;

    let data = new FormData();

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/request?sid='+sid,
    headers: { 
        'uid': uid, 
        'secret': secret, 
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };

    try {
        let resp = await axios.request(config)
        if(resp.data==null) {
            return []
        }
        return resp.data
    }
    catch(e) {
        console.log("ERROR GETTING REQUESTS" ,e.message,sid,secret,uid)
        return null
    }
}



async function addressedRequests() {
    let uid = await userStore.getState().uid;

    let reqs = await requestGet();
    let addressed = []
    for (let i = 0; i < reqs.length; i++) {
        if (reqs[i].to === uid) {
            addressed.push(reqs[i])
        }
    }
    return addressed
}


async function requestDelete(rid) {
    let uid = await userStore.getState().uid;
    let secret = await userStore.getState().secret;
    let sid = await sessionStore.getState().sesID;
    let data = new FormData();
    data.append('rid' , rid)
    let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/request?sid='+sid,
    headers: { 
        'uid': uid, 
        'secret': secret, 
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };

    try {
        let resp = await axios.request(config)
        return resp.data
    }
    catch(e) {
        console.log(e)
        return null
    }
}


async function pebbleCreate(hash,info) {
    let sid = await sessionStore.getState().sesID;
    let uid = await userStore.getState().uid;
    let secret = await userStore.getState().secret;

    info = info + ` FROM{${uid}}`
    let data = new FormData();
    data.append('hash', hash);
    data.append('info', info);

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/pebble?sid='+sid,
    headers: { 
        'uid': uid, 
        'secret': secret, 
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };

    try{
        let resp = await axios.request(config)
        return resp.data
    }
    catch(e) {
        console.log(e)
        return null
    }

}


async function MakeMeSeed(pid) {
    console.log("MAKING LOCAL USER SEED FOR" , pid)
    let sid = await sessionStore.getState().sesID;
    let uid = await userStore.getState().uid;
    let secret = await userStore.getState().secret;


    let data = new FormData();
    data.append('pid', pid);

    let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/pebble/mms?sid='+sid,
    headers: { 
        'uid': uid, 
        'secret': secret, 
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };
    try {
        let resp = await axios.request(config)
        console.log("SUCCESSFULLY MADE A SEED FOR" , pid)
        return resp.data
    }
    catch(e) {
        console.log(e)
        return null
    }
}



async function pebbleGet(pid) {

    let sid = await sessionStore.getState().sesID;
    let uid = await userStore.getState().uid;
    let secret = await userStore.getState().secret;


    let data = new FormData();
    data.append('pid', pid);

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/pebble/get?sid='+sid,
    headers: { 
        'uid': uid, 
        'secret': secret, 
        'Content-Type': 'multipart/form-data'
    },
    data : data
    };
    try {
        let resp = await axios.request(config)
        return resp.data
    }
    catch(e) {
        console.log(e)
        return null
    }
}


async function pebbleFindSeed(pid) {

    let uid = await userStore.getState().uid;
    let secret = await userStore.getState().secret;
    let sid = await sessionStore.getState().sesID;

    let data = new FormData();
    data.append('pid', pid);

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/pebble/findSeed?sid='+sid+'&pid='+pid,
    headers: { 
        'uid': uid, 
        'secret': secret, 
        'Content-Type': 'multipart/form-data'
    }
    };
    try {
        let resp = await axios.request(config)
        return resp.data

    }  
    catch(e) {
        console.log(e)
        return null
    }
}


module.exports = {login,requestCreate,requestDelete,register,createSession,joinSession,leaveSession,sessionMetadata,requestGet,addressedRequests,pebbleCreate,pebbleGet,pebbleFindSeed  ,MakeMeSeed}