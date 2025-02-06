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


const stagedPebbles = create((set) => ({
    stagedPebbles : [],
    setStagedPebbles: (stagedPebbles) => set({ stagedPebbles }),
}))

const stagedRequest = create((set) => ({
    stagedRequests : [],
    setStagedRequests: (stagedRequests) => set({ stagedRequests }),
}))


module.exports = {useLocalSDP,stagedPebbles,useDispatcherLastChecked , userStore , sessionStore , concernedRequestsStore , pebbleStore }