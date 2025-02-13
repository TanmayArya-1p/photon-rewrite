import { Image, StyleSheet, Platform , View,Text } from 'react-native';
import {useState , useEffect} from 'react'
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {PebbleDispatcher} from "@/components/pebble/dispatcher"
import {RequestHandler} from "@/components/pebble/RequestHandler"
import {useRouter} from 'expo-router'


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


  const router = useRouter()
  const [done,setDone] = useState(false)
  const [uid,setUid] = useState("")
  const [albumName,  setAlbumName] = useState("Camera")

  useEffect(() => {
    
    setTimeout(()=>router.replace("/login") , 1000)
  } , [])

  // useEffect(() => {
  //   console.log("DEVICE ID" , Device.manufacturer)
  //   if(Device.manufacturer == "vivo"){
  //     api.login("679ca682e95a24fe677605cc" , "123").then((res: any) => {
  //       console.log(res)
  //     });
  //   } else {
  //     setAlbumName("Pictures")
  //     api.login("679ca6d3e95a24fe677605cd" , "123").then((res: any) => {
  //       console.log(res)
  //     });
  //   }

  //   setDone(true)

  // },[uid])

  return (
    <View className='flex-1 mt-20 bg-blue ml-20'>
      <Text className='text-4xl text-red' style={{fontSize:20 , color:"red"}}>lol</Text>
      {/* {done && <PebbleDispatcher album={albumName} interval={10000}/>}
      {done && <RequestHandler album={albumName} poller_interval={10000}></RequestHandler>} */}
    </View>
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
