import axios from 'axios';
import {SERVER_URL} from "./config.json"
import { use } from 'react';
import { userStore , sessionStore } from './stores';


const FormData = require('form-data');



async function login(pwd) {
    let uid = userStore.getState().uid;
    let data = new FormData();
    data.append('uid', uid);
    data.append('password', pwd);

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL + '/user/login',
    headers: { 
        ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
        userStore.setState({secret: response.data["ClientSecret"]})
        return true
    })
    .catch((error) => {
        console.log(error);
        return false
    });
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
        ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
        userStore.setState({uid: response.data["UID"] , secret: response.data["ClientSecret"]})
        return response.data
        //ClientSecret
        //UID
    })
    .catch((error) => {
    console.log(error);
    return null
    });
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
        ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
        sessionStore.setState({sesID: sesID , sesKey: sesKey})
        return response.data
    })
    .catch((error) => {
        console.log(error);
        return null
    });
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
        ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    sessionStore.setState({sesID: "" , sesKey: ""})
    })
    .catch((error) => {
    console.log(error);
    });
}




async function sessionMetadata() {
    let sid = sessionStore.getState().sesID;
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;

    let data = new FormData();
    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/session?sid=' + sid,
    headers: { 
        'uid': uid, 
        'secret': secret, 
        ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    return response.data
    })
    .catch((error) => {
    console.log(error);
    return null
    });

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
        ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    return response.data
    })
    .catch((error) => {
    console.log(error);
    return null
    });

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
        ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    return response.data
    })
    .catch((error) => {
    console.log(error);
    return null
    });
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
        ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    return response.data
    })
    .catch((error) => {
    console.log(error);
    return null
    });
}


async function pebbleCreate(hash,info) {
    let sid = sessionStore.getState().sesID;
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;


    let data = new FormData();
    data.append('sid', sid);
    data.append('hash', hash);
    data.append('info', info);

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/pebble/create',
    headers: { 
        'uid': uid, 
        'secret': secret, 
        ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    return response.data
    })
    .catch((error) => {
    console.log(error);
    return null
    });

}



async function pebbleGet(pid) {

    let sid = sessionStore.getState().sesID;
    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;


    let data = new FormData();
    data.append('sid', sid);
    data.append('pid', pid);

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/pebble/get',
    headers: { 
        'uid': uid, 
        'secret': secret, 
        ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    return response.data
    })
    .catch((error) => {
    console.log(error);
    return null
    });

}


async function pebbleFindSeed(pid) {

    let uid = userStore.getState().uid;
    let secret = userStore.getState().secret;
    let sid = sessionStore.getState().sesID;

    let data = new FormData();
    data.append('sid',sid);
    data.append('pid', pid);

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/pebble/findSeed',
    headers: { 
        'uid': uid, 
        'secret': secret, 
        ...data.getHeaders()
    },
    data : data
    };
    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    return response.data
    })
    .catch((error) => {
    console.log(error);
    return null;
    });
}


module.exports = {login,requestCreate,requestDelete,register,joinSession,leaveSession,sessionMetadata,requestGet,addressedRequests,pebbleCreate,pebbleGet,pebbleFindSeed}