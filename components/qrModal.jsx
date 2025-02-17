import QRCode from 'react-native-qrcode-svg';
import { View , Text,Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'


export default function QrModal({isVisible,setIsVisible ,connectionString}) {
    return <>         
        <Modal 
        animationType='slide'
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}>
            <View className="w-full h-[50%] bg-white position-absolute bottom-0 items-center" style={{backgroundColor:"#f2f5ff" ,borderTopLeftRadius: 20 , borderTopRightRadius: 20 , position: 'absolute', bottom: 0 , height: "40%" , width: "100%"}}>
                <View style={{backgroundColor:"#2c4991" , borderTopLeftRadius:15 ,width:"100%",borderTopRightRadius:15 , padding:4 , justifyContent:"space-between" , flexDirection:"row",shadowColor: "#2c4991",shadowOffset: {width: 0,height: 2,},shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 5}}>
                    <Text style={{color:"white" , padding:3 , marginLeft:10 ,fontWeight:"bold", fontSize:18}}>Session QR Code</Text>
                    <Ionicons name="close-outline" size={30} style={{marginRight:5}} color="white" onPress={() => setIsVisible(false)}/>
                </View>
                <View className="mt-5">
                    <QRCode value={connectionString} size={200} logo={require("@/assets/images/photon.png")} />
                </View>
            </View>
        </Modal>
    </>

}    