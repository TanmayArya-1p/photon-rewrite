import React, { useEffect  , useState} from 'react';
import * as api from './api';
import * as MediaLibrary from 'expo-media-library';
import {useDispatcherLastChecked} from "./stores"
import * as actions from "./actions"
import {pebbleStore , sessionStore,stagedPebbles , EllipticCurve , lastChecked  ,albumObjStore} from "./stores"
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import {registerTasks} from "./background-fetch"
import {PollerD} from "./dispatcher-poller"





function PebbleDispatcher({album , interval}) {
    const [_, requestPermission] = MediaLibrary.usePermissions();
    // const [lastChecked , setLastChecked] = useState(Date.now())


    async function getAlbum() {
        await requestPermission();
        let fA = null
        try {
            fA = await MediaLibrary.getAlbumAsync(album);
        }
        catch(e) {
            console.log("ERROR FETCHING ALBUM" , e)
        }
        return(fA)
    }


    useEffect(() => {
        let pollerIntId = 0
        
        async function startup() {
            try{
                await registerTasks()
                let ec = await EllipticCurve.getState()
                ec.generateKeyPair()
                //await api.login("6797bb2bdd1ec3f885a9de6d", "123")
                await new Promise(resolve => setTimeout(resolve, 1000));
                //await api.createSession("123")
                await api.joinSession("679c1be0c164c81ac770449b" , "123")
                await sessionStore.setState({sesID: "679c1be0c164c81ac770449b"})

            }
            catch(e) {
                console.log(e)
            }
            try {
                let al = await getAlbum()
                albumObjStore.setState({albumObj: al})
                PollerD(al)
                pollerIntId = setInterval(() => {
                    PollerD()
                }, interval);
            }
            catch(e) {
                console.log("ERROR FETCHING ALBUM" , e)
            }


            

        }    
        startup()
        return () => clearInterval(pollerIntId)
    } , [])
    

    return <></>
}
    
module.exports = {PebbleDispatcher , PollerD}