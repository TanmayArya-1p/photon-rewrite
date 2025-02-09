import * as api from './api';
import * as MediaLibrary from 'expo-media-library';
import * as actions from "./actions"
import {pebbleStore ,stagedPebbles  , lastChecked  ,albumObjStore} from "./stores"


async function PollerD(albumObj=null) {
    if(albumObj == null) {
        albumObj = await albumObjStore.getState()
        albumObj = albumObj.albumObj
    }
    let pebStoreVal = await pebbleStore.getState().pebbles
    let alreadyDispatched = await stagedPebbles.getState().stagedPebbles
    console.log("PEBSTORE" , pebStoreVal)
    console.log("Local Pebbles:", Object.keys(pebStoreVal));
    try {
        let smeta = await api.sessionMetadata()

        let pebs = smeta.pebbles
        console.log("Pebbles:", pebs);
        
        for(let i=0; i< pebs.length ; i++) {
            if (!pebStoreVal[pebs[i].id] && !alreadyDispatched.includes(pebs[i].id)) {
                console.log("FINDING SEEDER FOR", pebs[i].id)
                let seeder = await api.pebbleFindSeed(pebs[i].id)
                if(seeder.found == false) {
                    console.log("NO SEEDER FOUND FOR", pebs[i].id)
                    continue
                }
                alreadyDispatched.push(pebs[i].id)
                await actions.BegSeeder(seeder , pebs[i])
            }
        }    
    
    }
    catch(e) {
        console.log("ERROR POLLING SERVER" , e)
    }

    //CHECKING NEW IMAGES LOCALLY PART
    let lc = await lastChecked.getState();
    lc = lc.lastChecked
    let albtemp = {}
    let vidtemp = {}
    try {
        //MediaLibrary.getAlbumsAsync().then((r) => console.log(r))
        albtemp = await MediaLibrary.getAssetsAsync({first:10000 ,album: albumObj , createdAfter: lc , sortBy: "creationTime" , mediaType:"photo"}) 
        vidtemp = await  MediaLibrary.getAssetsAsync({first:10000 ,album: albumObj , createdAfter: lc , sortBy: "creationTime" , mediaType: "video"})
        albtemp = albtemp.assets.concat(vidtemp.assets)
        if(albtemp.length > 0) {
            console.log("NEW ASSETS", albtemp)
        }
        actions.AppendNewImage(albtemp)
    }
    catch(e) {
        console.log("ERROR POLLING ASSETS" , e)
    }
    lastChecked.setState({lastChecked: new Date().getTime()})
}


module.exports = {PollerD}