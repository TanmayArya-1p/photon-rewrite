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
    let peb = await api.pebbleCreate("idontcareabouthash", "lol")
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
  let r= null
  console.log("DIDNT ERROR IN FILE UPLOAD " , pebbleStoreVal , photo)
  console.log("Started Upload : ",pebbleStoreVal.uri)
  try {
    const uri = pebbleStoreVal.uri;
    const filename = "test.jpg";
    const mimeType = 'image/jpg'
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
    return null
  }
  return r.route_id;
}


const GetImage = async (routeId,relay,masterKey,pebID , albumname) => {
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
    filename= `IMG_${dt.getFullYear()}${correctDate(dt.getMonth()+1)}${correctDate(dt.getDate())}_${correctDate(dt.getHours())}${correctDate(dt.getMinutes())}${correctDate(dt.getSeconds())}`
    const path = `${FileSystem.documentDirectory}${filename}.jpg`;
    console.log(`Saving file to: ${path}`);
    const { uri } = await FileSystem.downloadAsync(url, path);
    let asset = await MediaLibrary.createAssetAsync(uri);
    const album = await MediaLibrary.getAlbumAsync(albumname);
    if (album == null) {
      await MediaLibrary.createAlbumAsync(albumname, asset, true);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, true);
    }

  } catch (error) {
    if (error.response) {
      console.error(`Error response status: ${error.response.status}`);
      console.error(`Error response data: ${error.response.data}`);
    } else {
      console.error(`Error message: ${error.message}`);
    }
    Alert.alert('Error', `Error fetching the file: ${error.message}`);
  }
  pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [pebID]: asset}})

  return returner;
};

module.exports = {AppendNewImage , BegSeeder , UploadFile , GetImage}
