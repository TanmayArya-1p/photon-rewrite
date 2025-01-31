import { create } from 'zustand'
import { RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';

const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
    ],
};

const userStore = create((set) => ({
    uid: "",
    username: "",
    secret: "",
    setUid: (uid) => set({ uid }),
    setUsername: (username) => set({ username }),
    setSecret: (secret) => set({ secret }),
}))


const sessionStore = create((set) => ({
    sesID : "",
    sesKey : "",
    setSesID: (sesID) => set({ sesID }),
    setSesKey: (sesKey) => set({ sesKey }),
}))


const concernedRequestsStore = create((set) => ({
    requests : [],
    setRequests: (requests) => set({ requests }),

}))

const pebbleStore = create((set) => ({
    pebbles : {},
    setPebbles: (pebbles) => set({ pebbles }),

}))


const useDispatcherLastChecked = create((set) => ({
    lastChecked : Date.now(),
    setLastChecked: (lastChecked) => set({ lastChecked }),
}))



const useLocalSDP = create((set) => ({
    localSDP : "",
    setLocalSDP: (localSDP) => set({ localSDP }),
}))


const stagedPebbles = create((set) => ({
    stagedPebbles : [],
    setStagedPebbles: (stagedPebbles) => set({ stagedPebbles }),
}))

const Waiting = create((set) => ({
  waiting: false,
  setWaiting: (waiting) => set({ waiting }),
}));

const useWebRTCStore = create((set, get) => ({
  localSDP: "",
  remoteSDP: "",
  peerConnection: null,
  dataChannel: null,

  setLocalSDP: (localSDP) => set({ localSDP }),

  setRemoteSDP: async (remoteSDP) => {
    try {
      let peerConnection = get().peerConnection;
      
      if (!peerConnection) {
        peerConnection = new RTCPeerConnection(configuration);
        
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("New ICE candidate:", event.candidate);
          }
        };

        peerConnection.oniceconnectionstatechange = () => {
          console.log("ICE Connection State:", peerConnection.iceConnectionState);
          if (peerConnection.iceConnectionState === 'disconnected') {
            get().resetWebRTCClient();
          }
        };

        // Handle incoming data channels
        peerConnection.ondatachannel = (event) => {
          const dataChannel = event.channel;
          console.log("Received data channel:", dataChannel.label);
          set({ dataChannel });
          
          dataChannel.onopen = () => {
            console.log("Data channel is open");
          };
          
          dataChannel.onerror = (error) => {
            console.error("Data channel error:", error);
          };
          
          dataChannel.onclose = () => {
            console.log("Data channel closed");
          };
        };

        set({ peerConnection });
      } else{
        console.log("PeerConnection already exists" , remoteSDP)
      }

      const sdpString = remoteSDP;
      if (!sdpString.startsWith('v=0')) {
        throw new Error('Invalid SDP format');
      }

      const remoteDesc = new RTCSessionDescription({
        type: 'offer',
        sdp: sdpString
      });

      await peerConnection.setRemoteDescription(remoteDesc);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      set({ 
        localSDP: peerConnection.localDescription.sdp,
        remoteSDP: sdpString 
      });
    } catch (error) {
      console.error("Error in setRemoteSDP:", error);
      throw error;
    }
  },

  resetWebRTCClient: async () => {
    try {
      const peerConnection = new RTCPeerConnection(configuration);

      // Create data channel (for sending)
      const dataChannel = peerConnection.createDataChannel("fileTransfer", {
        ordered: true
      });

      dataChannel.onopen = () => {
        console.log("Data channel is open");
      };

      dataChannel.onerror = (error) => {
        console.error("Data channel error:", error);
      };

      dataChannel.onclose = () => {
        console.log("Data channel closed");
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("New ICE candidate:", event.candidate);
        }
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === 'disconnected') {
          get().resetWebRTCClient();
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log("LOCALSDP ", peerConnection.localDescription.sdp)
      set({ 
        peerConnection,
        dataChannel,
        localSDP: peerConnection.localDescription.sdp 
      });
    } catch (error) {
      console.error("Error in resetWebRTCClient:", error);
      throw error;
    }
  },

  cleanup: () => {
    const { peerConnection, dataChannel } = get();
    if (dataChannel) {
      dataChannel.close();
    }
    if (peerConnection) {
      peerConnection.close();
    }
    set({ 
      peerConnection: null, 
      dataChannel: null,
      localSDP: "",
      remoteSDP: ""
    });
  }
}));

module.exports = {useWebRTCStore,useLocalSDP,stagedPebbles,useDispatcherLastChecked , userStore , sessionStore , concernedRequestsStore , pebbleStore , Waiting}