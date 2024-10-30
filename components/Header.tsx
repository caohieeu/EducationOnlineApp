import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

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
import useUser from '@/hooks/useUser'
import { Feather } from '@expo/vector-icons'

export default function Header() {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Raleway_600SemiBold,
        Nunito_600SemiBold
    })

    const { user, loading } = useUser();

    if(!fontsLoaded && !fontError) {
        return null;
    }

    return (
    <View style={styles.container}>
        <View style={styles.headerWrapper}>
            <TouchableOpacity>
                <Image 
                    source={
                        user?.avatarUrl ? user.avatarUrl : 
                        require("@/assets/icons/profile.png")
                    }
                    style={styles.image}
                />
            </TouchableOpacity>
            <View>
                <Text
                    style={[styles.helloText, {fontFamily: "Raleway_700Bold"}]}
                >
                    Xin chào,
                </Text>
                <Text style={[styles.text, {fontFamily: "Raleway_700Bold"}]}>
                    {user?.dislayName}
                </Text>
            </View>
        </View>
        <TouchableOpacity style={styles.bellButton}>
            {/* <View>
                <Feather name="shopping-bag" size={26} color={"black"} />
                <View style={styles.bellContainer}></View>
            </View> */}
            <View>
                <Image 
                    source={require("@/assets/images/logo.png")}
                    style={styles.imgBanner}
                />
            </View>
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 15,
        paddingBottom: 1,
        width: "90%"
    },
    headerWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: 35,
        height: 35,
        marginRight: 8,
        borderRadius: 100
    },
    text: {
        fontSize: 16,
    },
    bellButton: {
        borderRadius: 8,
    },
    bellIcon: {
        alignSelf: "center"
    },
    bellContainer: {
        width: 10,
        height: 10,
        backgroundColor: "#2467EC",
        position: "absolute",
        borderRadius: 50,
        right: 0,
        top: 0,
    },
    helloText: {
        color: "#7C7C80",
        fontSize: 14
    },
    imgBanner: {
        width: 120,
        height: 80,
        marginRight: -35
    }
})