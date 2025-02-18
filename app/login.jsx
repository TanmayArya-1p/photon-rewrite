import {Button, SafeAreaView,Text ,StyleSheet, View , Image , ActivityIndicator , TouchableOpacity, Linking} from "react-native"
import * as AuthSession from 'expo-auth-session';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { retrieveAuthToken } from "./authFlow";
import { authConfig, discovery } from "./authConfig";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';




export default function LoginPage(props) {
    let [request, response, promptAsync] = AuthSession.useAuthRequest(authConfig, discovery)
    let [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log("REDIRECTED")

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
            }} className="bg-linear-to-r from-cyan-500 to-blue-500 p-2 rounded-xl">
                <LinearGradient className="flex-row justify-center items-center p-2" style={{borderRadius:10}} colors={['#383775', '#010030']}>
                    <Text className="text-white font-extrabold p-1 text-xl">Sign in</Text>
                    {loading? <ActivityIndicator size={24} color={"#ffffff"}/> : <Ionicons name="log-in" size={24} color="white" />}    

                </LinearGradient>
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'orange',
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 300,
    },
    button: {
      padding: 15,
      alignItems: 'center',
      borderRadius: 5,
    },
    text: {
      backgroundColor: 'transparent',
      fontSize: 15,
      color: '#fff',
    },
  });