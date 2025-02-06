import {useState,useEffect} from "react"
import * as api from "./api"
import * as actions from "./actions"
import {RELAY_URL , SERVER_URL , RELAY_KEY} from "./config.json" 
import {pebbleStore} from "./stores"


export default function RequestHandler() {



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
                    break
                    let rid = await actions.UploadFile(pebbleId)

                    try {    
                        let resp = await api.requestCreate(
                        req.from, 
                        "GETFILE", 
                        `${rid}|${RELAY_URL}|${RELAY_KEY}|${pebbleId}`
                        );      
                    } catch(e) {
                        console.log("ERROR CREATING GETFILE REQUEST" , e)
                    }
                    break
                case "GETFILE":
                    let [routeid, relay , rkey ,pebid] = req.content.split("|")
                    let localpebbles = await pebbleStore.getState().pebbles
                    if(!localpebbles[pebid]) {
                        await pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [pebid]: {data:"placeholder"}}})
                    }
                    await api.requestDelete(req.id)
                    actions.GetImage(routeid,relay,rkey,pebid)
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
        }, 10000);
        return () => clearInterval(interval);
    },[])


    return <></>
}