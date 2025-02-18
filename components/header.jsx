import {Image , Text , View} from "react-native";
import { Link } from 'expo-router';
import { userStore } from "@/app/stores/user";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HeaderComponent() {

    const {user} = userStore()

    return <View className="flex-row justify-between w-full align-middle">
        <Link href="/" className="mt-1 h-full">
            <Image className="mt-2" source={require("@/assets/images/photon-text.png")} style={{width: 150 , height: 30 , marginTop:1}}/>
        </Link>
        <Link href="/session" className="h-[100%]">
            {user!=null && user.is_alive && <StatusBox user={user}/>}  
        </Link>

    </View>
}

function StatusBox({user}) {
    return  <View className="flex-row items-center shadow-2xl rounded-lg h-full py-1.5 px-3 bg-white">
        
        <Ionicons name="radio-outline" className="mr-2" size={24} color="green"/>
        
        <Text className="font-light">{user.in_session.slice(0,8)+"..."}</Text>

    </View>
}