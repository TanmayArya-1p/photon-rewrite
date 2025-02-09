import { platformApiLevel } from 'expo-device';
import * as api from './api.jsx';
import {pebbleStore , EllipticCurve} from './stores.js';
import {RELAY_URL , SERVER_URL , RELAY_KEY} from "./config.json"
import base64 from 'base64-js';
import {PermissionsAndroid} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import axios from "axios"
import * as crypto from "./crypto.js"



async function AppendNewImage(assets) {
  for(let i =0 ; i< assets.length ; i++) {
    let asset = assets[i]
    let fsInfo = await FileSystem.getInfoAsync(asset.uri , {md5:true} )

    console.log("IMAGE HASH" , fsInfo.md5)
    let peb = await api.pebbleCreate(fsInfo.md5, asset.filename.split(" ").pop())
    console.log("APPENDING NEW LOCAL PEBBLE",peb)
    pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [peb.id]: asset}})
    console.log("PEBBLE STORE" , pebbleStore.getState())
  }
}


async function BegSeeder(seeder,pebble) {
    console.log("FOUND SEEDER" , seeder.Seed)
    let resp = null
    try {    
      let ec = await EllipticCurve.getState()
      let pubec = await ec.keyPair.publicKey
      let resp = await api.requestCreate(
        seeder.Seed.id, 
        "SENDFILE", 
        `${pebble.id}|${pubec}`
      );      
    } catch(e) {
      console.log("ERROR BEGGING SEEDER" , e)
    }

    return resp
}


const UploadFile = async (photo,pubKeyOfOther) => {
  let encryptionKey = null
  try {
    encryptionKey = await crypto.deriveSharedSecret(pubKeyOfOther)
  }
  catch(e) {
    console.log(e.message)
    return [null,null,null]
  }
  let authkey = "photon"
  let mkey = RELAY_KEY
  let serverUrl = RELAY_URL
  let pebbleStoreVal = pebbleStore.getState().pebbles[photo]

  let isVideo = pebbleStoreVal.mediaType !== "photo";

  console.log("Started Upload : ", pebbleStoreVal.uri);

  let assethash = (await FileSystem.getInfoAsync(pebbleStoreVal.uri, { md5: true })).md5;

  try {
    const encryptedUri = await crypto.encryptFileContents(pebbleStoreVal.uri, encryptionKey);

    const filename = pebbleStoreVal.filename;
    const data = new FormData();
    data.append('file', {
      uri: encryptedUri,
      type: 'application/octet-stream',
      name: filename
    });

    const fullurl = `${serverUrl}/upload?authkey=${authkey}&master_key=${mkey}`;
    console.log("UPLOADING TO", fullurl);

    let response = null;
    try {
      response = await axios.post(fullurl, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (e) {
      console.error("ERROR UPLOADING FILE IN AXIOS POST", e.message);
    }
    const r = response.data;
    console.log("Uploaded Encrypted File", r);
    return [r.route_id, pebbleStoreVal.filename, assethash];
  } catch (e) {
    console.error("ERROR UPLOADING FILE", e.message);
    return [null, null, null];
  }
};

//TODO: TESTING WITH HIGHER POLL RATE
//TODO : MAKE NOTIFICATION APPEAR RIGHT AFTER SESSION JOIN
//TODO SEE IF ENCRYPTION CAN BE OPTIMIZED
//TODO: EXPERIMENT WITH TERMINATE ON CLOSE = FALSE


const GetImage = async (routeId, relay, masterKey, pebID, albumname, fn, sourcehash,otherPrivKey) => {
  let returner = null;
  let serverUrl = relay;
  const url = `${serverUrl}/fetch/${routeId}?authkey=photon&master_key=${masterKey}`;
  console.log(`Request URL: ${url}`);
  try {
    const encryptedPath = FileSystem.cacheDirectory + 'downloadedEncrypted.tmp';
    console.log(`Downloading encrypted file to: ${encryptedPath}`);
    await FileSystem.downloadAsync(url, encryptedPath);
    const filename = fn;
    const decryptedPath = `${FileSystem.documentDirectory}${filename}`;
    console.log(`Decrypting file to: ${decryptedPath}`);

    const decryptionKey = await crypto.deriveSharedSecret(otherPrivKey);
    
    await crypto.decryptFileContents(encryptedPath, decryptionKey, decryptedPath);
    let asset = await MediaLibrary.createAssetAsync(decryptedPath);
    const album = await MediaLibrary.getAlbumAsync(albumname);
    if (album == null) {
        await MediaLibrary.createAlbumAsync(albumname, asset, true);
    } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, true);
    }
    
    let genfs = await FileSystem.getInfoAsync(asset.uri, { md5: true });
    console.log("Generated Asset Hash", genfs.md5);
    if (genfs.md5 !== sourcehash) {
        console.log("HASH MISMATCH WITH SOURCE ❌");
        return null;
    } else {
        console.log("HASH VERIFIED WITH SOURCE ✅");
    }

    pebbleStore.setState({ pebbles: { ...pebbleStore.getState().pebbles, [pebID]: asset } });
    await api.MakeMeSeed(pebID);
  } catch (error) {
      if (error.response) {
          console.error(`Error response status: ${error.response.status}`);
          console.error(`Error response data: ${error.response.data}`);
      } else {
          console.error(`Error message: ${error.message}`);
      }
      Alert.alert('Error', `Error fetching the file: ${error.message}`);
  }
  return returner;
};

module.exports = {AppendNewImage , BegSeeder , UploadFile , GetImage}
