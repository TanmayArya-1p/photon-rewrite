import { SafeAreaView , Text , ActivityIndicator,View, TouchableOpacity,Share } from "react-native";
import {userStore} from "../stores/user"
import { useEffect , useState } from "react";
import {PebbleDispatcher} from "@/components/pebble/dispatcher"
import {RequestHandler} from "@/components/pebble/RequestHandler"
import * as api from "@/components/pebble/api"
import {pebbleStore , sessionStore} from "@/components/pebble/stores"
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-web";
import * as Clipboard from 'expo-clipboard';


export default function SessionPage(props) {
    const { user, setUser } = userStore()
    const [done,setDone] = useState(false)
    const [albumName,  setAlbumName] = useState("Camera")
    const {pebbles: ps} = pebbleStore()
    const {sesID , sesKey } = sessionStore()
    const [connectionString , setConnectionString] = useState("")

    useEffect(() => {
        if(user.is_alive == false) return
        api.login(user.pebble_uid , user.pebble_password).then(()=> {
            console.log("Logged in to PebbleDB" ,res)
        })
        setConnectionString(sesID + "|" + sesKey + "|" + "lol.onetincan.tech")
        setDone(true)
    },[user])

    if(user.is_alive == false) {
        return <SafeAreaView className="flex-1 justify-center align-center bg-white">
            <Text className="text-black w-full text-center text-2xl">Currently Not In A Session</Text>
        </SafeAreaView>

    }




    if(!done) {
        return <SafeAreaView className="flex-1 bg-white items-center justify-center w-full">
        <ActivityIndicator size={50} color="#0000ff" />
        <Text className="text-black">Logging in to PebbleDB</Text>
      </SafeAreaView>
    }
    return <SafeAreaView className="flex-1 bg-white items-center w-full">
        <View className="mt-[10%] w-[90%] ml-[10%] items-center flex-row">
            <Ionicons name="sync-outline" className="p-4" size={50} color="black" />
            <Text className="text-black text-3xl">Syncing Images</Text>
        </View>
        <View>
            <Text className="p-2.5 bg-slate-200 rounded-xl">{Object.keys(ps).length} Images Synced in Current Session</Text>
        </View>
        <View className="mt-8 bg-slate-100 p-3 rounded-xl w-[90%]">
            <Text className="text-lg font-bold">Session Info</Text>
            <Text className="text-md mt-2">Session ID: {sesID}</Text>
            <Text className="text-md mt-1">Session Key: {sesKey}</Text>
        </View>
        <View className="mt-5 bg-blue-950 p-2 flex-row rounded-tr-xl justify-between rounded-tl-xl w-[90%]">
            <Text className="text-white font-extrabold justify-center mt-1">Connection String</Text>
            <View className="flex-row">
                <TouchableOpacity className="bg-blue-500 rounded-md mx-3 p-1 items-center justify-center">
                    <Ionicons name="qr-code-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Clipboard.setStringAsync(connectionString)} className="bg-blue-500 rounded-md p-1 items-center justify-center">
                    <Text className="font-extrabold text-white mx-2">Copy</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View className="p-3 bg-blue-900 shadow-blue-900 shadow-2xl rounded-br-xl rounded-bl-xl w-[90%]">
            <Text className="text-sm text-white">{connectionString.slice(0,50) + "..."}</Text>
        </View>
        <View className="mt-4 flex-row justify-between w-[90%]">
            <TouchableOpacity onPress={() => Share.share({
                message: "Join My Session on Photon:\n" + connectionString + "\nphoton://join?=" + connectionString
            })} className="flex-row items-center justify-center bg-slate-200 p-3 rounded-lg w-[49%]">
                <Ionicons name="person-add-outline" className="mr-2" size={20} color="black" />
                <Text className="text-center font-bold text-black">Invite Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-center bg-red-100 p-2 rounded-lg w-[49%]">
                <Ionicons name="exit-outline" className="mr-2" size={20} color="black" />
                <Text className="text-center font-bold text-black">Leave</Text>
            </TouchableOpacity>
        </View>

        {/* {done && <PebbleDispatcher album={albumName} interval={10000} />}
        {done && <RequestHandler album={albumName} poller_interval={10000} />} */}
    </SafeAreaView>
}

//CONNECTION STRING FORMAT:
//SESSIONID|SESSIONKEY|PEBBLEDB