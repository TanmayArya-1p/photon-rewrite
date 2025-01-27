import { create } from 'zustand'


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

const pebblesStore = create((set) => ({
    pebbles : [],
    setPebbles: (pebbles) => set({ pebbles }),

}))


module.exports = {userStore , sessionStore , concernedRequestsStore , pebblesStore}