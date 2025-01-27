import React, { useEffect  , useState} from 'react';
import * as api from './api';
import * as MediaLibrary from 'expo-media-library';
import {useDispatcherLastChecked} from "./stores"
import * as actions from "./actions"

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
                await api.login("67926aa4e5fe7e9979ff270f", "123")
                await new Promise(resolve => setTimeout(resolve, 1000));
                await api.createSession("123")
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

    

    return <></>
}
    