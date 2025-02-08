import { create } from 'zustand'
import { ec as EC } from 'elliptic';
import * as ExpoCrypto from 'expo-crypto';

function bytesToHex(bytes) {
    return Array.from(bytes).map((a) => a.toString(16).padStart(2, '0')).join('');
}

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

const EllipticCurve = create((set , get) => {
    return {
        curve: new EC('secp256k1'),
        keyPair: null,
        setKeyPair: (keyPair) => set({ keyPair }),
        generateKeyPair : async () => {
            const randBytes = await ExpoCrypto.getRandomBytesAsync(32);
            const privKeyHex = bytesToHex(randBytes);
            const keyPair = get().curve.keyFromPrivate(privKeyHex);
            const publicKeyHex = keyPair.getPublic().encode('hex');
            let returner = { privateKey: privKeyHex, publicKey: publicKeyHex };
            set({ keyPair : returner });
            return returner;
        }
    }
})


module.exports = {EllipticCurve,useLocalSDP,stagedPebbles,useDispatcherLastChecked , userStore , sessionStore , concernedRequestsStore , pebbleStore }