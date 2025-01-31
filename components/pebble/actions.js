import * as api from './api.jsx';
import {pebbleStore , Waiting , useWebRTCStore} from './stores.js';


async function AppendNewImage(asset) {
    let peb = await api.pebbleCreate("idontcareabouthash", "lol")
    console.log("APPENDING NEW LOCAL PEBBLE",peb)
    pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [peb.id]: asset}})
    console.log("PEBBLE STORE" , pebbleStore.getState())
}


async function BegSeeder(seeder,pebble) {
    console.log("FOUND SEEDER" , seeder.Seed)
    let resp = null
    try {    
      const { setRemoteSDP } = useWebRTCStore.getState();
      await setRemoteSDP(seeder.Seed.sdp);
      const {localSDP} = useWebRTCStore.getState();

      resp = await api.requestCreate(seeder.Seed.id, "SETANSSDP" , localSDP )
      Waiting.setState({waiting : true})
      WaitDownload(pebble)
    } catch(e) {
      console.log("ERROR BEGGING SEEDER" , e)
    }

    return resp
}


async function WaitDownload(pebble) {
  let receivedBuffers = [];
  const { peerConnection } = useWebRTCStore.getState();
  
  if (!peerConnection) {
    throw new Error("PeerConnection not initialized");
  }

  return new Promise((resolve, reject) => {
    peerConnection.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      console.log("Received data channel:", receiveChannel.label);

      receiveChannel.onopen = () => {
        console.log("Receive channel opened");
      };

      receiveChannel.onerror = (error) => {
        console.error("Receive channel error:", error);
        reject(error);
      };

      receiveChannel.onmessage = async (event) => {
        try {
          const receivedData = event.data;
          console.log("Received data chunk of size:", receivedData.size || receivedData.length);

          if (typeof receivedData === 'string' && receivedData === 'EOF') {
            const blob = new Blob(receivedBuffers, { type: 'image/jpeg' });
            const tempFilePath = FileSystem.documentDirectory + 'tempFile';
            
            await FileSystem.writeAsStringAsync(tempFilePath, blob);
            receivedBuffers = []; 
            pebbleStore.setState({ 
              pebbles: { 
                ...pebbleStore.getState().pebbles, 
                [pebble.id]: "newpebblelol" 
              } 
            });

            await api.MakeMeSeed(pebble.id);
            Waiting.setState({ waiting: false });
            resolve(tempFilePath);
          } else {
            receivedBuffers.push(receivedData);
          }
        } catch (error) {
          console.error("Error processing received data:", error);
          reject(error);
        }
      };

      receiveChannel.onclose = () => {
        console.log("Receive channel closed");
        useWebRTCStore.getState().resetWebRTCClient();
      };
    };
  });
}

module.exports = {AppendNewImage , BegSeeder}
