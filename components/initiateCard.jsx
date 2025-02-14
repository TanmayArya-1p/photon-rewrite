import {View, Text , TouchableOpacity, TextInput , StyleSheet, Button} from 'react-native'
import { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import {useState} from 'react'
import { CameraView, Camera } from "expo-camera";


export default function InitiateCard({user}) {
    const [connectionString, setConnectionString] = useState("")
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannerOpened , setScannerOpened] = useState(false)
  
    useEffect(() => {
      const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      };
  
      getCameraPermissions();
    }, []);
  
    const handleBarcodeScanned = ({ type, data }) => {
      setScanned(true);
      setScannerOpened(false)
      setConnectionString(data);
      setScanned(false)
    };


    if(scannerOpened) {
        return <>
            <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
            }}
            className="rounded-xl"
            style={StyleSheet.absoluteFillObject}/>
            <TouchableOpacity onPress={() => setScannerOpened(a=>!a)} className="p-2 shadow-xl position-absolute bottom-0 mt-[100%]">
                    <LinearGradient
                        className="flex-row justify-center items-center p-2"
                        style={{ borderRadius: 7 }}
                        colors={['rgba(255, 255, 255,0.5)', 'rgba(255, 255, 255,0.5)']}
                    >
                    <Text className="text-white font-extrabold p-1 text-xl text-center">Close Scanner</Text>
                    <Ionicons name="close-outline" size={24} color="white" />
                    </LinearGradient>
            </TouchableOpacity>
        
        </>
    }

  
    return (
      <>
      {/* {hasPermission == true && <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
        barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
        />} */}

        {/* {scanned && (hasPermission==true) && (
            <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
        )} */}
        <View className="bg-white rounded-xl shadow-2xl p-6 mt-10 w-[70%] mx-auto">
          <View className="justify-center items-center flex-row mh-2">
            <Text className="text-gray-400 font-bold font-mono text-lg text-center">
              {user.is_alive ? "In Session " : "Not in a Session" }
            </Text>
            {!user.is_alive ? <Ionicons name="cloud-offline-outline" className="ml-2" size={20} color="gray" /> : <Ionicons name="radio-outline" className="ml-2" size={20} color="green" />}
          </View>
        </View>
        {!user.is_alive &&
        <View className="bg-white rounded-xl items-center shadow-2xl  mt-4 w-[90%] mx-auto">
            <View className="flex-col bg-white rounded-xl shadow-2xl p-4 mt-4 w-[90%] mx-auto">
                <View className="flex-row justify-center items-center ml-3 p-1 mr-2">
                    <TextInput
                    value={connectionString}
                    onChange={(r) => setConnectionString(r.target.value)}
                    className="bg-slate-50 text-center h-12 rounded-xl p-2 w-full"
                    placeholder="Enter Connection String"
                    />
                    <TouchableOpacity onPress={() => setScannerOpened(a=>!a)} className="p-2 shadow-xl mt-2">
                        <Ionicons name="qr-code-outline" className="mb-1" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={() => console.log(1)} className="p-2 shadow-xl mt-1">
                    <LinearGradient
                        className="flex-row justify-center items-center p-2"
                        style={{ borderRadius: 7 }}
                        colors={['#00288a', '#2c4991']}
                    >
                        <Text className="text-white font-extrabold p-1 text-xl text-center">Join Session</Text>
                        <Ionicons name="log-in-outline" size={24} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

          <View className="flex-col mt-2 w-[90%] mb-2">

            <TouchableOpacity onPress={() => console.log(1)} className="p-2 shadow-xl">
              <LinearGradient
                className="flex-row justify-center items-center p-2"
                style={{ borderRadius: 7 }}
                colors={['#00288a', '#2c4991']}
              >
                <Text className="text-white font-extrabold p-1 text-xl text-center">Create Session</Text>
                <Ionicons name="add-outline" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>}
      </>
    )
}