import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import HeaderScreen from '@/components/HeaderScreen'
import { router } from 'expo-router';
import {
    useFonts,
    Raleway_700Bold,
    Raleway_600SemiBold
} from '@expo-google-fonts/raleway'
import {
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_600SemiBold
} from "@expo-google-fonts/nunito"
import MyVideoPlayer from '@/components/MyVideoPlayer';
import { SignalRContext } from '@/app/_layout';

export default function WaitingRoomScreen() {
    const connection = React.useContext(SignalRContext);
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Raleway_600SemiBold,
        Nunito_600SemiBold
    })

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <LinearGradient
            colors={["#E5ECF9", "#F6F7F9"]}
            style={{ flex: 1 }}
        >
            <HeaderScreen titleHeader="Phòng chờ" />
            <View style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
            }}>
                <Text style={{
                    fontFamily: "Nunito_600SemiBold",
                    fontSize: 18
                }}>
                    Xin vui lòng chờ, người chủ trì cuộc
                </Text>
                <Text style={{
                    fontFamily: "Nunito_600SemiBold",
                    fontSize: 18
                }}>
                    họp sẽ sớm cho bạn vào...
                </Text>
                <ActivityIndicator
                    style={{ marginTop: 10 }}
                    size={50}
                    color={"#2865e3"}
                />
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({})