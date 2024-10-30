import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import Swiper from "react-native-swiper";
import { bannerData } from "@/constants/constants";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";

export default function HomeBarSlider() {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    if(!fontsLoaded && !fontError) {
        return null;
    }

    return (
    <View style={styles.container}>
        <Swiper
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        autoplay={true}
        autoplayTimeout={5}
        >
        {bannerData.map((item: BannerDataTypes, index: number) => (
            <View key={index} style={{flex: 1}}>
            <Image
                source={item.bannerImageUrl! || "https://static-00.iconduck.com/assets.00/image-not-found-01-icon-2048x2048-95wsi7vg.png"}
                style={{ width: 400, height: 250 }}
            />
            </View>
        ))}
        </Swiper>
    </View>
    )
}

const styles = StyleSheet.create({
    dot: {
        backgroundColor: "#C6C7CC",
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 3,
    },
    container: {
        marginTop: 12,
        height: hp("35%"),
        marginHorizontal: 8,
    },
    activeDot: {
        backgroundColor: "#2467EC",
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 3,
    },

})