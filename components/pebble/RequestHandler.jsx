import {useState,useEffect} from "react"
import * as api from "./api"
import * as actions from "./actions"
import {RELAY_URL , SERVER_URL , RELAY_KEY} from "./config.json" 
import {pebbleStore , stagedPebbles} from "./stores"


export default function RequestHandler({poller_interval , album}) {



    async function Poller() {

        let reqs= await api.addressedRequests()

        console.log("ADDRESSED REQUESTS", reqs)
        for(let i=0; i<reqs.length; i++) {
            let req = reqs[i]
            switch(req.code) {
                case "SENDFILE":
                    let pebbleId = req.content
                    await api.requestDelete(req.id)
                    console.log("DELETED REQUEST" , req.id)
                    let [rid,fn] = await actions.UploadFile(pebbleId)
                    console.log("ROUTE ID" , rid)
                    console.log("TRANSMITTED FILENAME" , fn)

                    try {    
                        let resp = await api.requestCreate(
                        req.from, 
                        "GETFILE", 
                        `${rid}|${RELAY_URL}|${RELAY_KEY}|${pebbleId}|${fn}`
                        );      
                    } catch(e) {
                        console.log("ERROR CREATING GETFILE REQUEST" , e)
                    }
                    break
                case "GETFILE":
                    let [routeid, relay , rkey ,pebid , getfilename] = req.content.split("|")
                    let localpebbles = await pebbleStore.getState().pebbles
                    if(!localpebbles[pebid]) {
                        await pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [pebid]: {data:"placeholder"}}})
                    }
                    let sps = await stagedPebbles.getState().stagedPebbles;
                    let updatedSps = sps.filter(item => item !== pebid);
                    stagedPebbles.setState({ stagedPebbles: updatedSps });
                    await api.requestDelete(req.id)
                    actions.GetImage(routeid,relay,rkey,pebid , album , getfilename)
                    break
                default:
                    break
            }
        }
            
    }

    useEffect(() => {
        Poller()
        const interval = setInterval(() => {
            Poller()
        }, poller_interval);
        return () => clearInterval(interval);
    },[])


    return <></>
}