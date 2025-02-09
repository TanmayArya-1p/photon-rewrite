import {useState,useEffect} from "react"
import * as api from "./api"
import * as actions from "./actions"
import {RELAY_URL , SERVER_URL , RELAY_KEY} from "./config.json" 
import {pebbleStore , stagedPebbles , EllipticCurve , albumObjStore} from "./stores"



async function PollerRH() {

    let reqs= await api.addressedRequests()
    console.log("ADDRESSED REQUESTS", reqs)

    try{
        for(let j=0; j<reqs.length; j++) {
            await api.requestDelete(reqs[j].id)
            console.log("DELETED REQUEST" , reqs[j].id)
        }    
    }
    catch(e) {
        console.log("ERROR DELETING REQUESTS" , e)
        return
    }

    for(let i=0; i<reqs.length; i++) {
        let req = reqs[i]
        switch(req.code) {
            case "SENDFILE":
                let [pebbleId,sfOtherPrivKey] = req.content.split("|")
                let [rid,fn,shash] = await actions.UploadFile(pebbleId , sfOtherPrivKey)
                console.log("ROUTE ID" , rid)
                console.log("TRANSMITTED FILENAME" , fn)
                let ec = await EllipticCurve.getState()
                try {    
                    let resp = await api.requestCreate(
                    req.from, 
                    "GETFILE", 
                    `${rid}|${RELAY_URL}|${RELAY_KEY}|${pebbleId}|${fn}|${shash}|${ec.keyPair.publicKey}`
                    );      
                } catch(e) {
                    console.log("ERROR CREATING GETFILE REQUEST" , e)
                }
                break
            case "GETFILE":
                try{
                    let [routeid, relay , rkey ,pebid , getfilename,sourcehash,otherPrivKey] = req.content.split("|")
                    let localpebbles = await pebbleStore.getState().pebbles
                    if(!localpebbles[pebid]) {
                        await pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [pebid]: {data:"placeholder"}}})
                    }
                    let sps = await stagedPebbles.getState().stagedPebbles;
                    let updatedSps = sps.filter(item => item !== pebid);
                    stagedPebbles.setState({ stagedPebbles: updatedSps });
                    let albname = await albumObjStore.getState()
                    albname = albname.albumObj
                    actions.GetImage(routeid,relay,rkey,pebid , albname.title , getfilename , sourcehash , otherPrivKey)
                    break
                } catch(e) {
                    console.log("ERROR ON GET FILE REQUEST" , e.message)
                }

            default:
                break
        }
    }
        
}



export default function RequestHandler({poller_interval , album}) {
    useEffect(() => {
        PollerRH()
        const interval = setInterval(() => {
            PollerRH()
        }, poller_interval);
        return () => clearInterval(interval);
    },[])


    return <></>
}


module.exports = {PollerRH , RequestHandler}