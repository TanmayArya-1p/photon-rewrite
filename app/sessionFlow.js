import axios from "axios"
import {userStore} from "./stores/user"
import {pebbleUserStore} from "./stores/pebble"

async function JoinSession(sessionkey ,sessionid) {
    let data = new FormData();
    data.append('SessionKey',sessionkey);
    data.append('SessionID',sessionid);
    let user = await userStore.getState()
    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL + '/join-session',
    headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization' : `Bearer ${user.accessToken}`

    },
    data : data
    };

    try {
        let resp = await axios.request(config)
        console.log(resp.data)
        let updState={ ...user, user: {...user.user,is_alive:true, in_session:sessionid} }
        userStore.setState(updState);
        console.log("USER STATE UPDATED" , updState)
        return true,resp.data
    }
    catch(e) {
        return false,e.message
    }
}


async function CreateSession(sessionkey ,sessionid) {
    let data = new FormData();
    data.append('SessionKey',sessionkey);
    data.append('SessionID',sessionid);
    let user = userStore.getState()
    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL + '/create-session',
    headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization' : `Bearer ${user.accessToken}`
    },
    data : data
    };

    try {
        let resp = await axios.request(config)
        console.log(resp.data)
        let updState={ ...user, user: {...user.user,is_alive:true, in_session:sessionid} }
        userStore.setState(updState);
        console.log("USER STATE UPDATED" , updState)
        return true,resp.data
    }
    catch(e) {
        return false,e.message
    }
}



module.exports= {
    JoinSession,
    CreateSession
}


