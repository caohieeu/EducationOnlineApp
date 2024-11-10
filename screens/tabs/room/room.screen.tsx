import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

import {
  useFonts,
  Raleway_700Bold,
} from '@expo-google-fonts/raleway'
import { HUB_URI, SERVER_URI } from '@/utils/uri';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SignalRContext } from '@/app/_layout';

export default function RoomScreen() {
  const connection = React.useContext(SignalRContext);
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
  })
  const [roomKey, setRoomKey] = useState("");
  // const [requestData, setRequestData] = useState({
  //     cmd: "roomRequest",
  //     roomKey: "123"
  // });

  
  if (!fontsLoaded && !fontError) {
    return null;
  }

  const onJoinRoomRequest = async () => {
    const token = await AsyncStorage.getItem("access_token");
    axios.post(`${SERVER_URI}/api/Room/JoinRoomRequest`, {
      cmd: "roomRequest",
      roomKey: roomKey
    }, {
        headers: {
            "Cookie": token?.toString()
        },
    })
        .then((res) => {
          router.push({
            pathname: "(routes)/room/waiting-room"
            // pathname: "(routes)/room/stream-room"
          });
          console.log(res.data)
        })
        .catch((err) => console.error("Error when join room ", err));
    sendMessage()
}

const sendMessage = () => {
    if (connection) {
        connection.invoke('ConnectToRoom')
            .catch(err => console.error('Error sending message', err));
    }
};

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ width: "100%", paddingHorizontal: 45 }}>
        <Text style={{
          fontFamily: "Raleway_700Bold",
          fontSize: 30,
          textAlign: "center"
        }}>
          Tham gia phòng học
        </Text>

        <TextInput
          onChangeText={(text) => setRoomKey(text)}
          value={roomKey}
          placeholder="Room key"
          style={{
            width: "100%",
            height: 50,
            borderColor: "#575757",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginTop: 50
          }}
        />
        <TouchableOpacity
          onPress={onJoinRoomRequest}
          style={{
            width: "100%",
            borderRadius: 8,
            padding: 15,
            backgroundColor: "#2865e3",
            marginTop: 25
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>
            Tham gia
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({})