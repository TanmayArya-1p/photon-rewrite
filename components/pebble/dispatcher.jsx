import React, { useEffect  , useState} from 'react';
import * as api from './api';
import * as MediaLibrary from 'expo-media-library';
import {useDispatcherLastChecked} from "./stores"
import * as actions from "./actions"
import {pebbleStore , sessionStore,stagedPebbles,useWebRTCStore, Waiting} from "./stores"

//have a background taskas well as set itnerval
export default function PebbleDispatcher({album , interval}) {
    const [_, requestPermission] = MediaLibrary.usePermissions();
    const [lastChecked , setLastChecked] = useState(Date.now())


    async function getAlbum() {
        await requestPermission();
        let fA = null
        try {
            fA = await MediaLibrary.getAlbumAsync(album);
        }
        catch(e) {
            console.log("ERROR FETCHING ALBUM" , e)
        }
        console.log(fA)
        return(fA)
    }


    async function Poller(albumObj) {

        //NEED TO CHECK FOR NEW IMAGES ON SERVER
        
        let wait = await Waiting.getState()
        let pebStoreVal = await pebbleStore.getState().pebbles
        let alreadyDispatched = await stagedPebbles.getState().stagedPebbles
        console.log("Local Pebbles:", Object.keys(pebStoreVal));
        try {
            if(!wait.waiting) {
                // let pebStoreVal = pebbleStore.getState().pebbleStore
                // let alreadyDispatched = stagedPebbles.getState().stagedPebbles
                let smeta = await api.sessionMetadata()
                let pebs = smeta.pebbles
        
                
                for(let i=0; i< pebs.length ; i++) {
                    if(wait.waiting) {
                        break
                    }
                    if (!pebStoreVal[pebs[i].id] && !alreadyDispatched.includes(pebs[i].id)) {
                        console.log("FINDING SEEDER FOR", pebs[i].id)
                        let seeder = await api.pebbleFindSeed(pebs[i].id)
                        if(seeder.found == false) {
                            console.log("NO SEEDER FOUND FOR", pebs[i].id)
                            continue
                        }
                        alreadyDispatched.push(pebs[i].id)
                        await actions.BegSeeder(seeder)
                    }
                }    
            }
    

        }
        catch(e) {
            console.log("ERROR POLLING SERVER" , e)
        }

        console.log("HERE")
        //CHECKING NEW IMAGES LOCALLY PART
        setLastChecked(async (prevLastChecked) => {
            let lc = await prevLastChecked;
            let albtemp = {}
            try {
                albtemp = await MediaLibrary.getAssetsAsync({first:10000 ,album: albumObj , createdAfter: lc , sortBy: "creationTime"}) 
                albtemp = albtemp.assets
                if(albtemp.length > 0) {
                    console.log("NEW ASSETS", albtemp)
                }
                
                albtemp.forEach((a) => {
                    actions.AppendNewImage(a)
                })
    
            }
            catch(e) {
                console.log("ERROR POLLING ASSETS" , e)
            }
            return new Date().getTime();
        })



    }

    useEffect(() => {
        let pollerIntId = 0
        
        async function startup() {

            try{
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
                Poller(al)
                pollerIntId = setInterval(() => {
                    Poller(al)
                }, interval);
            }
            catch(e) {
                console.log("ERROR FETCHING ALBUM" , e)
            }


            

        }    
        startup()
        return () => clearInterval(pollerIntId)
    } , [])
    const { resetWebRTCClient } = useWebRTCStore();
    
    useEffect(()=> {
       
        resetWebRTCClient();    
    },[])


    return <></>
}
    