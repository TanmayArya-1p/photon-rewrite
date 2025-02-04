import { Image, StyleSheet, Platform } from 'react-native';
import {useState , useEffect} from 'react'
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PebbleDispatcher from "@/components/pebble/dispatcher"
import * as api from "@/components/pebble/api"
import * as Device from 'expo-device';


export default function HomeScreen() {

  const [done,setDone] = useState(false)
  const [uid,setUid] = useState("")
  useEffect(() => {
    console.log("DEVICE ID" , Device.manufacturer)
    if(Device.manufacturer == "vivo"){
      setUid("679c0fb769d549b92faa4401")
    } else {
      setUid("679c0fd569d549b92faa4402")
    }
    api.login(uid , "123").then((res: any) => {
      console.log(res)
    });
    setDone(true)

  },[uid])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      {done && <PebbleDispatcher album={"Camera"} interval={5000}/>}
      
      <ThemedView style={styles.titleContainer}>
        
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
