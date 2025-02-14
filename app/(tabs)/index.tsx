import { Image, StyleSheet, Platform , View,Text, SafeAreaView, ActivityIndicator } from 'react-native';
import {useState , useEffect} from 'react'
import {PebbleDispatcher} from "@/components/pebble/dispatcher"
import {RequestHandler} from "@/components/pebble/RequestHandler"
import {useRouter} from 'expo-router'
import * as SecureStorage from "expo-secure-store"
import {userStore} from "./../stores/user"
import initiateCard from "@/components/initiateCard"
import * as api from "@/components/pebble/api"
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { validateAccessToken } from '../authFlow';
import InitiateCard from '@/components/initiateCard';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


function fixName(name : string) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase()
}

export default function HomeScreen() {


  const router = useRouter()
  const [done,setDone] = useState(false)
  const [uid,setUid] = useState("")
  const [albumName,  setAlbumName] = useState("Camera")
  const [verified, setVerified] = useState(false)
  const [user,setUser] = useState(null)

  useEffect(() => {
    //FIRST VERIFY IF BRO IS AUTHENTICATED

    async function verify() {
      let accessToken = await SecureStorage.getItemAsync("accesstoken")
      let status = await validateAccessToken(accessToken)
      if(status){
        let user = await userStore.getState()
        console.log("LOCAL USER" , user.user)
        setUser(user.user)
        setVerified(true)

        console.log("VERIFIED USER")
      } else {
        router.replace("/login")
      }
    }
    verify()
    
  } , [setUser])

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

  if(!verified) {
    return <SafeAreaView className="flex-1 bg-white items-center justify-center w-full">
      <ActivityIndicator size={50} color="#0000ff" />
    </SafeAreaView>
  }

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center w-full">
      <View className="flex-1 mt-[20%] w-[90%] items-center">
        <Text className="italic text-4xl ">Welcome {fixName(user.name.split(" ")[0])}</Text>
        <InitiateCard user={user}></InitiateCard>




      </View>
      {/* {done && <PebbleDispatcher album={albumName} interval={10000}/>}
      {done && <RequestHandler album={albumName} poller_interval={10000}></RequestHandler>} */}
    </SafeAreaView>
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
