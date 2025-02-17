import { Image, StyleSheet, Platform , View,Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import {useState , useEffect} from 'react'
import {useRouter} from 'expo-router'
import * as SecureStorage from "expo-secure-store"
import {userStore} from "../stores/user"
import { pebbleUserStore } from '../stores/pebble';
import initiateCard from "@/components/initiateCard"
import * as api from "@/components/pebble/api"
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as sessionFlow from "../sessionFlow"
import { validateAccessToken } from '../authFlow';
import InitiateCard from '@/components/initiateCard';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


function fixName(name) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase()
}

export default function HomeScreen() {


  const router = useRouter()
  const [verified, setVerified] = useState(false)
  const [user,setUser] = useState(null)


  async function createSessionHandler(sesKey) {
    console.log("CREATE")

    try {
      console.log(0)

      let res = await api.createSession(sesKey)
      if(res==null) {
        Alert.alert("Error Creating Session")
        return
      }
      console.log(1)
      res = res["SessionID"]
      console.log(3,res)

      let status = await sessionFlow.CreateSession(sesKey , res)
      console.log(2,status)

      if(status) {
        console.log("SESSION CREATED")
        router.navigate("/session")
      } else {
        console.log("ERROR CREATING SESSION")
        Alert.alert("Error Creating Session")
      }
    } catch(e) {
      Alert.alert("Error Creating Session : "  + e.message)
    }

  }


  async function joinSessionHandler(connectionString) {
    console.log("JOIN")
    let [sesID ,sesKey , pebbleDB] = connectionString.split("|")
    try {
      console.log(0,sesID,sesKey)
      let apiresp = await api.joinSession(sesID,sesKey)
      if(apiresp == null) {
        Alert.alert("Error Joining Session")
        return
      }
      console.log(1)
      let status = await sessionFlow.JoinSession(sesKey , sesID)
      console.log(2,status)
      if(status) {
        console.log("SESSION JOINED")
        router.navigate("/session")
      } else {
        console.log("ERROR JOINING SESSION")
        Alert.alert("Error Joining Session")
      }
    } catch(e) {
      Alert.alert("Error Joining Session : "  + e.message)
    }

  }

  useEffect(() => {
    //FIRST VERIFY IF BRO IS AUTHENTICATED

    async function verify() {
      let accessToken = await SecureStorage.getItemAsync("accesstoken")
      let status = await validateAccessToken(accessToken)
      if(status){
        let user = await userStore.getState()
        console.log("LOCAL USER" , user.user)
        setUser(user.user)
        await pebbleUserStore.setState({PebbleClientID : user.user.pebble_uid , PebbleClientSecret : user.user.pebble_secret })
        let res = await api.login(user.user.pebble_uid , user.user.pebble_password)
        if(res["InSession"]!= "") {
          console.log("ALREADY IN SESSION")
          user.user.is_alive = true
          user.user.insession = res["InSession"]
          router.navigate("/session")
        }
        setUser(user.user)
        userStore.setState({user: user.user})
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
      <View className="flex-1 mt-[10%] w-[90%] items-center">
        <Text className="italic text-4xl ">Welcome {fixName(user.name.split(" ")[0])}</Text>
        <InitiateCard createSessionHandler={createSessionHandler} joinSessionHandler={joinSessionHandler} user={user}></InitiateCard>




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
