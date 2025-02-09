import { Image, StyleSheet, Platform } from 'react-native';
import {useState , useEffect} from 'react'
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {PebbleDispatcher} from "@/components/pebble/dispatcher"
import {RequestHandler} from "@/components/pebble/RequestHandler"

import * as api from "@/components/pebble/api"
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {

  const [done,setDone] = useState(false)
  const [uid,setUid] = useState("")
  const [albumName,  setAlbumName] = useState("Camera")


  useEffect(() => {
    console.log("DEVICE ID" , Device.manufacturer)
    if(Device.manufacturer == "vivo"){
      api.login("679ca682e95a24fe677605cc" , "123").then((res: any) => {
        console.log(res)
      });
    } else {
      setAlbumName("Pictures")
      api.login("679ca6d3e95a24fe677605cd" , "123").then((res: any) => {
        console.log(res)
      });
    }

    setDone(true)

  },[uid])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      {done && <PebbleDispatcher album={albumName} interval={10000}/>}
      {done && <RequestHandler album={albumName} poller_interval={10000}></RequestHandler>}
      <ThemedView style={styles.titleContainer}>
        
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
