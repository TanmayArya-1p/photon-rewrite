import {View,Text,TouchableOpacity, SafeAreaView,StyleSheet} from "react-native";
import * as Linking from 'expo-linking';
import { useRouter } from "expo-router";

export default function DeepLinkManager() {
    const router = useRouter()
    const url = Linking.useURL();
    console.log("DEEPLINK URL",url)


    if(url==null) {
        router.navigate("/notfound")
    }

    return <SafeAreaView className="flex-1 bg-white justify-center align-center">
        <Text className="text-black text-2xl">Deep Link Manager</Text>
    </SafeAreaView>
}

