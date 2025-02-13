import {Button, Text , View} from "react-native"
import * as AuthSession from 'expo-auth-session';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { retrieveAuthToken } from "./authFlow";
import { authConfig, discovery } from "./authConfig";


export default function LoginPage(props) {
    let [request, response, promptAsync] = AuthSession.useAuthRequest(authConfig, discovery)


    useEffect(() => {
        if(response && response.type === "success") {
            retrieveAuthToken(response.params.code, request.codeVerifier).then((tokenResponse) => {
                console.log(jwtDecode(tokenResponse))
            }).catch(e => console.log("ERROR PARSING JWT OF AUTHCODE " , e.message))
        }
    } , [response])


    async function LoginWorkflow() {
        promptAsync()
    }

    return <>
        <Text>blah</Text>
        <Button onPress={async () => LoginWorkflow()} title="LOGIN HERE" className="bg-blue"></Button>
    </>
}