import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions"
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
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
import { router } from 'expo-router';

export default function VideoCourseCard({ item }: { item: VideoCourse }) {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Raleway_600SemiBold,
        Nunito_600SemiBold
    })

    const [dateCreated, setDateCreated] = useState("");
    const [time, setTime] = useState("");

    useEffect(() => {
        const date = new Date(item.time);

        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        setDateCreated(formattedDate);
    }, [])

    return (
        <TouchableOpacity 
            onPress={() => router.push({
                pathname: "(routes)/video",
                params: { videoInfo : JSON.stringify(item) }
            })}
            style={styles.container}>
            <View style={{ paddingHorizontal: 10 }}>
                {/* <Image
                    style={{
                        width: wp(86),
                        height: 220,
                        borderRadius: 5,
                        alignSelf: "center",
                        objectFit: "cover",
                    }}
                    source={{ uri: item.thumbnail || "" }}
                /> */}
                <View style={{ width: wp(85) }}>
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: "left",
                            marginTop: 10,
                            fontFamily: "Raleway_700Bold",
                        }}
                    >
                        {item.title}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#141517",
                            padding: 4,
                            borderRadius: 5,
                            gap: 4,
                            paddingHorizontal: 10,
                            height: 28,
                            marginTop: 10,
                        }}
                    >
                        <View style={{
                            flexDirection: "row",
                        }}>
                            <View style={{
                                flexDirection: "row", 
                                justifyContent: "space-around", 
                                alignItems: "center"
                            }}>
                                <FontAwesome name="thumbs-up" size={14} color={"#ffb800"} />
                                <Text style={[styles.ratingText]}>{item.like}</Text>
                            </View>
                            <View style={{
                                flexDirection: "row", 
                                justifyContent: "space-around", 
                                alignItems: "center",
                                marginLeft: 20
                            }}>
                                <FontAwesome name="eye" size={14} color={"#ffb800"} />
                                <Text style={[styles.ratingText]}>{item.like}</Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons name="calendar" size={20} color={"#8A8A8A"} />
                        <Text style={{ marginLeft: 5, fontFamily: "Nunito_400Regular" }}>
                            {dateCreated}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingBottom: 5,
                    }}
                >
                </View>
                <View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFF",
        marginHorizontal: 6,
        borderRadius: 12,
        width: responsiveWidth(90),
        height: "auto",
        overflow: "hidden",
        margin: "auto",
        marginVertical: 15,
        padding: 8,
        
    },
    ratingText: {
        color: "white",
        fontSize: 14,
        paddingLeft: 5
    }
})