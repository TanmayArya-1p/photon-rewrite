import {create} from "zustand"


export const pebbleUserStore = create((set) => {
    return {
        serverURL : "https://lol.onetincan.tech",
        setServerURL : (serverURL) => set({serverURL}),
        PebbleClientID : "",
        setPebbleClientID : (PebbleClientID) => set({PebbleClientID}),
        PebbleClientSecret : "",
        setPebbleClientSecret : (PebbleClientSecret) => set({PebbleClientSecret}),
    }
})