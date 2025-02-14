import axios from 'axios'
import { discovery , CLIENT_SECRET , CLIENT_ID , REDIRECT_URI } from './authConfig';
import * as SecureStore from 'expo-secure-store';
import {serverURL} from "./stores/stores"
import {pebbleUserStore} from "./stores/pebble"
import {userStore} from "./stores/user"

export async function validateAccessToken(accesstoken)  {
  try {
    const response = await axios.post(`${serverURL}/login`, {}, {
      headers: {
      'Authorization': `Bearer ${accesstoken}`
      }
    });
    userStore.setState({user: response.data})
    userStore.setState({accessToken: accesstoken})
    pebbleUserStore.setState({PebbleClientID: response.data.pebble_uid})
    pebbleUserStore.setState({PebbleClientSecret: response.data.pebble_secret})
    return true;
  } catch(e) {
    console.log("ERROR LOGGING IN " , e.message)
    return false
  }
}

export async function retrieveAuthToken(authCode, codeVerifier) {  
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('code', authCode);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('grant_type', 'authorization_code');
    params.append('code_verifier', codeVerifier);
  
    const body = params.toString();  
    try {
      const response = await axios.post(discovery.tokenEndpoint, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }
      });
      console.log("RETURNED AUTH TOKEN" , response.data.access_token.slice(0,10)+"...")
      SecureStore.setItemAsync("accesstoken", response.data.access_token);

      return response.data.access_token;

    } catch (error) {
        console.log("ERROR IN RETRIEVING AUTHTOKEN" , error.message)
        return null;
    }
}