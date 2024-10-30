import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

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

export default function SearchInput() {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Raleway_600SemiBold,
        Nunito_600SemiBold
    })

    if(!fontsLoaded && !fontError) {
        return null;
    }

    return (
    <View style={styles.filteringContainer}>
        <View style={styles.searchContainer}>
        <TextInput 
            style={[styles.input, {fontFamily: "Nunito_700Bold"}]}
            placeholder="Tìm kiếm"
            placeholderTextColor={"#C67cc"}
        />
        <TouchableOpacity style={styles.searchIconContainer}>
            <AntDesign 
                name="search1"
                size={20}
                color={"#fff"}
            />
        </TouchableOpacity>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    filteringContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: "black",
        paddingVertical: 10,
        paddingLeft: 5,
        width: 271,
        height: 48,
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    searchIconContainer: {
        width: 36,
        height: 36,
        backgroundColor: "#2467EC",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
})