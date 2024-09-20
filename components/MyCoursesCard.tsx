import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { responsiveWidth, responsiveHeight } from "react-native-responsive-dimensions"
import { Ionicons } from '@expo/vector-icons'
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

export default function MyCoursesCard({ item }: { item: Course }) {
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
        const date = new Date(item.cdate);

        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        setDateCreated(formattedDate);
    }, [])

    if(!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: "(routes)/course/course-detail",
                params: { courseId: item._id }
            })}
            style={styles.container}>
            <View style={{ flexDirection: "row" }}>
                <Image
                    style={{
                        width: wp(38),
                        height: "100%",
                        borderRadius: 5,
                        alignSelf: "center",
                        objectFit: "cover",
                    }}
                    source={{ uri: item.courseImage }}
                />
                <View style={{ 
                    width: wp(40),
                    flexDirection: "column",
                    marginHorizontal: 10,
                    padding: 5,
                    paddingRight: 20
                 }}>
                    <Text
                        style={{
                            fontSize: 15,
                            textAlign: "left",
                            marginTop: 10,
                            height: 70,
                            fontFamily: "Raleway_700Bold",
                        }}
                    >
                        {item.title.length >= 50 ? item.title.substring(0, 50) + "..." :
                            item.title}
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingBottom: 5,
                        }}
                    >
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingTop: 10,
                            marginLeft: 15
                        }}>
                            <Ionicons name="person" size={15} color={"#8A8A8A"} />
                            <Text style={{
                                fontSize: 15,
                                fontFamily: "Nunito_400Regular",
                                paddingLeft: 10,
                                marginRight: 15
                            }}>
                                {item.cuser.user_name.length >= 8 ? 
                                item.cuser.user_name.substring(0, 8) + "..." : 
                                item.cuser.user_name}
                            </Text>

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
                    </View>
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
        borderRadius: 12,
        width: responsiveWidth(90),
        height: "auto",
        overflow: "hidden",
        margin: "auto",
        marginVertical: 15,
    },
    ratingText: {
        color: "white",
        fontSize: 14,
        paddingLeft: 5
    }
})