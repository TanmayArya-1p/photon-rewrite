import axios from 'axios';
import {SERVER_URL} from "./config.json"
const FormData = require('form-data');



async function login(uid,pwd) {
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
        return response.data
        //ClientSecret
        //UID
    })
    .catch((error) => {
    console.log(error);
    return null
    });
}



async function joinSession(uid,secret,sesKey , sesID) {
    let data = new FormData();
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
        return response.data
    })
    .catch((error) => {
        console.log(error);
        return null
    });
}



async function leaveSession(uid,secret) {
    let data = new FormData();
    let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: SERVER_URL+'/session/leave?sid=67926b32e5fe7e9979ff2710',
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
    })
    .catch((error) => {
    console.log(error);
    });
}




async function sessionMetadata(sid,uid,secret) {
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



async function requestCreate(targetuid , uid, secret , sid , code, content) {
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



async function requestGet(sid,uid,secret) {
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



async function addressedRequests(sid,uid,secret) {
    let reqs = await requestGet(sid,uid,secret);
    let addressed = []
    for (let i = 0; i < reqs.length; i++) {
        if (reqs[i].to === uid) {
            addressed.push(reqs[i])
        }
    }
}


async function requestDelete(uid,sid,secret) {
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


async function pebbleCreate(sid,uid,hash,info,secret) {
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



async function pebbleGet(sid,uid,secret,pid) {
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


async function pebbleFindSeed(uid,secret,sid,pid) {
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