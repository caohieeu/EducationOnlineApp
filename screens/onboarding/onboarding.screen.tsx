import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useFonts, Raleway_700Bold } from '@expo-google-fonts/raleway'
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito"
import { LinearGradient } from 'expo-linear-gradient'
import { styles } from '@/styles/onboard'
import { router } from 'expo-router'

export default function OnBoardingScreen() {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold
    })
    if(!fontsLoaded && !fontError) {
        return null;
    }
    return (
        <LinearGradient 
            colors={["#E5ECF9", "#F6F7F9"]} 
            style={{flex: 1, alignItems: "center", justifyContent: "center"}}
        >
            <View style={styles.firstContainer}>
                <View>
                    <Image
                        style={styles.logo}
                        source={require("@/assets/images/logo.png")}
                    />
                </View>
                <View style={styles.titleWrapper}>
                    <Text style={[styles.titleText, {fontFamily: "Raleway_700Bold"}]}>
                        Start Learning With Education Online
                    </Text>
                </View>
                <View style={styles.dscpWrapper}>
                    <Text style={[styles.dscpText, {fontFamily: "Nunito_400Regular"}]}>
                        Explore all classes and lessons livestreamed  
                    </Text>
                    <Text style={[styles.dscpText, {fontFamily: "Nunito_400Regular"}]}>
                        by instructors
                    </Text>
                </View>
                <TouchableOpacity 
                style={styles.buttonWrapper}
                // onPress={() => router.push("/(routes)/welcome-intro")}
                onPress={() => router.push("/(routes)/auth/signin")}
                >
                    <Text style={[styles.buttonText, {fontFamily: "Nunito_400Regular"}]}>
                        Getting Started
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}