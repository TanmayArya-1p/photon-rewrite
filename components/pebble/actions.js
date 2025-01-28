import * as api from './api.jsx';
import {pebbleStore , Waiting , useWebRTCStore} from './stores.js';


async function AppendNewImage(asset) {
    let peb = await api.pebbleCreate("idontcareabouthash", "lol")
    console.log("APPENDING NEW LOCAL PEBBLE",peb)
    pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [peb.id]: asset}})
    console.log("PEBBLE STORE" , pebbleStore.getState())
}


async function BegSeeder(seeder,pebble) {
    console.log("FOUND SEEDER" , seeder)
    const { setRemoteSDP } = useWebRTCStore.getState();
    await setRemoteSDP(seeder.localSDP);
    const {localSDP} = useWebRTCStore.getState();
    let resp = await api.requestCreate(seeder.id, "SETANSSDP" , localSDP )
    Waiting.setState({waiting : true})
    WaitDownload(pebble)
    return resp
}


async function WaitDownload(pebble) {
    const { peerConnection } = useWebRTCStore.getState();
  
    peerConnection.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = (event) => {
        const receivedData = event.data;
        console.log("Received data:", receivedData);
        //tetsing


        pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [pebble.id]: "newpebblelol"}})
        api.MakeMeSeed(pebble.id)
        Waiting.setState({waiting : false})
        
      };
    };

}

module.exports = {AppendNewImage}
