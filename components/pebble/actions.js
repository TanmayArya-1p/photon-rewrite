import { platformApiLevel } from 'expo-device';
import * as api from './api.jsx';
import {pebbleStore} from './stores.js';
import {RELAY_URL , SERVER_URL , RELAY_KEY} from "./config.json"
import base64 from 'base64-js';
import {PermissionsAndroid} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import axios from "axios"


async function AppendNewImage(asset) {
    let peb = await api.pebbleCreate("idontcareabouthash", asset.filename.split(" ").pop())
    console.log("APPENDING NEW LOCAL PEBBLE",peb)
    pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [peb.id]: asset}})
    console.log("PEBBLE STORE" , pebbleStore.getState())
}


async function BegSeeder(seeder,pebble) {
    console.log("FOUND SEEDER" , seeder.Seed)
    let resp = null
    try {    
      let resp = await api.requestCreate(
        seeder.Seed.id, 
        "SENDFILE", 
        `${pebble.id}`
      );      
    } catch(e) {
      console.log("ERROR BEGGING SEEDER" , e)
    }

    return resp
}


const UploadFile = async (photo) => {


  let authkey = "photon"
  let mkey = RELAY_KEY
  let serverUrl = RELAY_URL
  let pebbleStoreVal = await pebbleStore.getState().pebbles[photo]
  let isVideo = false;
  if(pebbleStoreVal.mediaType != "photo") {
    isVideo = true
  }
  let r= null
  console.log("Started Upload : ",pebbleStoreVal.uri)
  try {
    const uri = pebbleStoreVal.uri;
    const filename = pebbleStoreVal.filename;
    const extension = filename.split('.').pop().toLowerCase();
    const mimeMap = {
      'jpg': 'image/jpg',
      'jpeg': 'image/jpg',
      'png': 'image/png',
      'gif': 'image/gif',
      'mp4': 'video/mp4'
    };
    const mimeType = mimeMap[extension];
    const data = new FormData();
        data.append('file', {
        uri: uri,
        type: mimeType,
        name: filename,
        });
    
    fullurl = `${serverUrl}/upload?authkey=${authkey}&master_key=${mkey}`
    console.log("UPLOADING TO" , fullurl)
    const response =  await fetch(fullurl, {
    method: 'POST',
    body: data,
    });
    r= await response.json()
    console.log("Uploaded Image",r)
  }
  catch(e) {
    console.log("ERROR UPLOADING FILE" , e.message)
    return [null,null]
  }
  return [r.route_id,pebbleStoreVal.filename];
}


const GetImage = async (routeId,relay,masterKey,pebID , albumname  ,fn) => {
  //routeid,relay,rkey,pebid
  let returner = null
  let serverUrl = relay
  const url = `${(serverUrl)}/fetch/${routeId}?authkey=${"photon"}&master_key=${masterKey}`;
  console.log(`Request URL: ${url}`);
  try {
    dt = new Date()
    function correctDate(a) {
        otpt = String(a)
        if(otpt.length == 1){
            return "0"+otpt
        }
        else {
            return otpt
        }
    }

    let filename= fn
    const path = `${FileSystem.documentDirectory}${filename}`;
    console.log(`Saving file to: ${path}`);
    const { uri } = await FileSystem.downloadAsync(url, path);
    let asset = await MediaLibrary.createAssetAsync(uri);
    const album = await MediaLibrary.getAlbumAsync(albumname);
    if (album == null) {
      await MediaLibrary.createAlbumAsync(albumname, asset, true);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, true);
    }
    console.log("Generated Asset" , asset)
    pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [pebID]: asset}})
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
