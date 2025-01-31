import axios from 'axios';
import {SERVER_URL} from "./config.json"
import { userStore , sessionStore,useWebRTCStore } from './stores'


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
        return resp.data
    }
    catch(e) {
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
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;
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
        sessionStore.setState({sesID: resp.data["SessionID"] , sesKey: sesKey})
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
        sessionStore.setState({sesID: sesID , sesKey: sesKey})
        return resp.data
    }
    catch(e) {

        return null
    }
}



async function leaveSession() {
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;
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
        sessionStore.setState({sesID: "" , sesKey: ""})
        return resp.data
    }
    catch(e) {
        console.log(e)
        return null
    }

}




async function sessionMetadata() {
    let sid = sessionStore.getState().sesID;
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;

    let data = new FormData();
    let sdp = await useWebRTCStore.getState()

    data.append("localSDP" , sdp.localSDP)
    let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/session?sid=' + sid,
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
        return null
    }

}



async function requestCreate(targetuid , code, content) {
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;
    let sid = sessionStore.getState().sesID;

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
    let sid = sessionStore.getState().sesID;
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;

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
        return resp.data
    }
    catch(e) {
        console.log(e)
        return null
    }
}



async function addressedRequests() {
    let sid = sessionStore.getState().sesID;
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;


    let reqs = await requestGet(sid,uid,secret);
    let addressed = []
    for (let i = 0; i < reqs.length; i++) {
        if (reqs[i].to === uid) {
            addressed.push(reqs[i])
        }
    }
}


async function requestDelete() {
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;
    let sid = sessionStore.getState().sesID;
    let data = new FormData();

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
    let sid = sessionStore.getState().sesID;
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;

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
    
    let sid = sessionStore.getState().sesID;
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;


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
        return resp.data
    }
    catch(e) {
        console.log(e)
        return null
    }
}



async function pebbleGet(pid) {

    let sid = sessionStore.getState().sesID;
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;


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

    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;
    let sid = sessionStore.getState().sesID;

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


module.exports = {login,requestCreate,requestDelete,register,createSession,joinSession,leaveSession,sessionMetadata,requestGet,addressedRequests,pebbleCreate,pebbleGet,pebbleFindSeed}