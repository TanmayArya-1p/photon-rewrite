import axios from "axios"
import {userStore} from "./stores/user"
import {serverURL} from "./stores/stores"
import {pebbleUserStore} from "./stores/pebble"

const SERVER_URL = serverURL

async function JoinSession(sessionkey ,sessionid) {
    let user = await userStore.getState()

    let config = null
    try {
        config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: SERVER_URL + '/join-session',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${user.accessToken}`
    
        },
        data : {
            'session_key':sessionkey,
            'session_id':sessionid
        }
        };
    }
    catch(e) {
        console.log("ERROR IN JOIN SESSION" , e.message)
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
    let user = userStore.getState()
    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SERVER_URL + '/create-session',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${user.accessToken}`
    },
    data : {
        'session_key':sessionkey,
        'session_id':sessionid
    }
    };
    console.log("CONFIG" , config.data)

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


