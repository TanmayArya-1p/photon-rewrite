import {Modal, View, Text} from 'react-native'



export default function CreateSessionModal({modalVisible , setModalVisible , sesKeyState}) {
    

    return <>         
        <Modal 
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
            <View className="w-full h-[25%] bg-white position-absolute bottom-0" style={{borderTopLeftRadius: 20 , borderTopRightRadius: 20 , position: 'absolute', bottom: 0}}>
                <Text>tester</Text>
            </View>
    </Modal>
    </>
}