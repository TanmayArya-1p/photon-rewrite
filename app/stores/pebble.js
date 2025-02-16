import {create} from "zustand"


export const pebbleUserStore = create((set) => {
    return {
        PebbleClientID : "",
        setPebbleClientID : (PebbleClientID) => set({PebbleClientID}),
        PebbleClientSecret : "",
        setPebbleClientSecret : (PebbleClientSecret) => set({PebbleClientSecret}),
    }
})