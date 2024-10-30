import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HeaderScreen({titleHeader, styleHeader} : {titleHeader:string, styleHeader:string}) {
  return (
    <View
        style={{
            paddingVertical: 20
        }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginHorizontal: 20,
          marginTop: 25,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          {styleHeader == null ? (
            <AntDesign name="left" size={26} />
          ) : (
            <AntDesign name="left" size={26} color={'white'} />
          )}
        </TouchableOpacity>
        {styleHeader == null ? (
          <Text
          style={{
            fontFamily: "Raleway_700Bold",
            fontSize: 25,
            paddingLeft: 15
          }}
        >
          {titleHeader}
        </Text>
        ) : (
          <Text
          style={{
            fontFamily: "Raleway_700Bold",
            fontSize: 25,
            paddingLeft: 15,
            color: "#fff"
          }}
        >
          {titleHeader}
        </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})