import {create} from "zustand"



const settingsStore = create((set) => ({
    pebbleServerURL: "https://lol.onetincan.tech",
    relayServerUrl: "https://frelay.onetincan.tech",
    relayKey: "123",
    setPebbleServerURL: (pebbleServerURL) => set({pebbleServerURL}),
    setRelayServerUrl: (relayServerUrl) => set({relayServerUrl}),
    setRelayKey: (relayKey) => set({relayKey})
}))



module.exports = {settingsStore}
// {
//     "SERVER_URL" : "https://lol.onetincan.tech",
//     "RELAY_URL" : "https://frelay.onetincan.tech",
//     "RELAY_KEY" : "123",
//     "BACKGROUND_POLL_INTERVAL" : 30
// }