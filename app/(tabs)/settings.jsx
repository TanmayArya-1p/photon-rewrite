import { SafeAreaView, TouchableOpacity  , Text,View} from "react-native";
import {Logout} from "./../authFlow"


export default function SettingsPage(props) {
    return <SafeAreaView className="flex-1 bg-white">
        <View className="mt-20">
            <TouchableOpacity onPress={()=>Logout()} className="bg-gray-200 p-2 rounded-xl">
                <Text className="text-black font-bold p-2">Lougout</Text>
            </TouchableOpacity>
        </View>

    </SafeAreaView>
}

