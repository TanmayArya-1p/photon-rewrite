import { create } from 'zustand'

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


const StagedPebbles = create((set) => ({
    stagedPebbles : [],
    setStagedPebbles: (stagedPebbles) => set({ stagedPebbles }),
}))

const Waiting = create((set) => ({
    waiting : false,
    setWaiting: (waiting) => set({ waiting }),
}))


const useWebRTCStore = create((set) => ({
    localSDP: "",
    remoteSDP: "",
    peerConnection: null,
    setLocalSDP: (localSDP) => set({ localSDP }),
    setRemoteSDP: async (remoteSDP) => {
      const peerConnection = useWebRTCStore.getState().peerConnection;
      const remoteDesc = new RTCSessionDescription({ type: 'offer', sdp: remoteSDP });
      await peerConnection.setRemoteDescription(remoteDesc);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      set({ localSDP: peerConnection.localDescription.sdp });
    },
    resetWebRTCClient: async () => {
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
        }
      };
      peerConnection.oniceconnectionstatechange = () => {
        if (peerConnection.iceConnectionState === 'disconnected') {
          useWebRTCStore.getState().resetWebRTCClient();
        }
      };
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer);
      set({ peerConnection, localSDP: peerConnection.localDescription.sdp });
    },
  }));

module.exports = {useWebRTCStore,useLocalSDP,StagedPebbles,useDispatcherLastChecked , userStore , sessionStore , concernedRequestsStore , pebbleStore , Waiting}