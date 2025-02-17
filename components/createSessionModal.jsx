import Ionicons from '@expo/vector-icons/Ionicons'
import {Modal, View, Text, TextInput, TouchableOpacity} from 'react-native'
import { useState } from 'react'


export default function CreateSessionModal({modalVisible , setModalVisible , sesKeyState , setSesKeyState,createSessionHandler}) {
    const [isVisible, setIsVisible] = useState(false)
    const [txt , setTxt] = useState("")
    return <>         
        <Modal 
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
            <View className="w-full h-[50%] bg-white position-absolute bottom-0" style={{backgroundColor:"#f2f5ff" ,borderTopLeftRadius: 20 , borderTopRightRadius: 20 , position: 'absolute', bottom: 0 , height: "40%" , width: "100%"}}>
                <View style={{backgroundColor:"#2c4991" , borderTopLeftRadius:15 ,borderTopRightRadius:15 , padding:4 , justifyContent:"space-between" , flexDirection:"row",shadowColor: "#2c4991",shadowOffset: {width: 0,height: 2,},shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 5}}>
                    <Text style={{color:"white" , padding:3 , marginLeft:10 ,fontWeight:"bold", fontSize:18}}>Create Session | Set a Session Key</Text>
                    <Ionicons name="close-outline" size={30} style={{marginRight:5}} color="white" onPress={() => setModalVisible(false)}/>
                </View>
                <Text style={{marginTop:10 , marginLeft:10 , fontWeight:"bold" , fontSize:15 , textAlign:"center"}}>Your Session Key acts like a password for your Session</Text>
                <View style={{flexDirection:"col", width:"100%" ,justifyContent:"center" , alignItems:"center"}}>
                    <View style={{flexDirection:"row" , justifyContent:"center" , alignItems:"center" , width:"100%"}}>
                        <TextInput secureTextEntry={!isVisible} style={{borderRadius:10 ,backgroundColor:"white" , padding:10 ,width:"70%" ,marginTop:26 , alignContent:"center"}} value={sesKeyState} onChangeText={(a)=>setSesKeyState(a)}></TextInput>
                        <TouchableOpacity onPress={() => setIsVisible(a=>!a)} style={{backgroundColor:"white" , padding:10 , borderRadius:10 , marginTop:26 , marginLeft:10}}>
                            <Ionicons name="eye-outline" size={20}></Ionicons>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={()=> {
                        console.log("SESKEYSTATE" , sesKeyState)
                        createSessionHandler(sesKeyState)}} style={{backgroundColor:"#2c4991" , padding:10 , borderRadius:10 , marginTop:16 , marginLeft:10 , marginRight:10}}>
                        <Text style={{color:"white" , textAlign:"center" , fontWeight:"bold"}}>Create Session</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </>
}