import {Button, SafeAreaView,Text , View , Image , ActivityIndicator , TouchableOpacity, Linking} from "react-native"
import * as AuthSession from 'expo-auth-session';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { retrieveAuthToken } from "./authFlow";
import { authConfig, discovery } from "./authConfig";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from "@react-navigation/native";




export default function LoginPage(props) {
    let [request, response, promptAsync] = AuthSession.useAuthRequest(authConfig, discovery)
    let [loading, setLoading] = useState(false)

    useEffect(() => {
        if(response && response.type === "success") {
            retrieveAuthToken(response.params.code, request.codeVerifier).then((tokenResponse) => {
                console.log(jwtDecode(tokenResponse))
                setLoading(false)
            }).catch(e => console.log("ERROR PARSING JWT OF AUTHCODE " , e.message))
        }
    } , [response])


    async function LoginWorkflow() {
        setLoading(true)
        promptAsync()
    }

    return <>
    <SafeAreaView className="flex-1">
        <SafeAreaView className="flex-1 bg-yellow-50 justify-center items-center">
            <Image source={require("@/assets/images/photon-text.png")} style={{width:300, height:70}} className="ml-1 mb-32" />
            <TouchableOpacity onPress={() => {
                LoginWorkflow()
            }} className="bg-slate-700 p-2 rounded-lg">
                <View className="flex-row justify-center items-center p-1">
                    <Text className="text-white font-extrabold p-1 text-xl">Sign in</Text>
                    {loading? <ActivityIndicator size={24} color={"#ffffff"}/> : <Ionicons name="log-in" size={24} color="white" />}    

                </View>
            </TouchableOpacity>
        </SafeAreaView>
        <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'flex-start' }} className="ml-2">
            <TouchableOpacity onPress={() => Linking.openURL("https://github.com/phot-ON")}>
                <Ionicons name="logo-github" size={24} color="black" />
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    </>
}