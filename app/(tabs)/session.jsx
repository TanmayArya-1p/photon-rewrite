import { SafeAreaView , Text , ActivityIndicator} from "react-native";
import {userStore} from "../stores/user"
import { useEffect } from "react";
import {PebbleDispatcher} from "@/components/pebble/dispatcher"
import {RequestHandler} from "@/components/pebble/RequestHandler"


export default function SessionPage(props) {
    const { user, setUser } = userStore()

    if(user.is_alive == false) {
        return <SafeAreaView className="flex-1 justify-center align-center bg-white">
            <Text className="text-black w-full text-center text-2xl">Currently Not In A Session</Text>
        </SafeAreaView>

    }

    const [done,setDone] = useState(false)
    const [albumName,  setAlbumName] = useState("Camera")

    useEffect(() => {
        api.login(user.pebble_uid , user.pebble_secret).then(()=> {
            console.log("Logged in to PebbleDB" ,res)
        })
        setDone(true)
    },[user])

    if(!done) {
        return <SafeAreaView className="flex-1 bg-white items-center justify-center w-full">
        <ActivityIndicator size={50} color="#0000ff" />
        <Text className="text-black">Logging in to PebbleDB</Text>
      </SafeAreaView>
    }

    return <SafeAreaView className="flex-1 bg-white items-center justify-center w-full">
        <Text className="text-black">Session</Text>
        {done && <PebbleDispatcher album={albumName} interval={10000}/>}
        {done && <RequestHandler album={albumName} poller_interval={10000}></RequestHandler>}
    </SafeAreaView>
}

//CONNECTION STRING FORMAT:
//SESSIONID|SESSIONKEY|PEBBLEDB