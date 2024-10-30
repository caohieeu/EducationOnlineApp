import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-notifications';
import useUser from '@/hooks/useUser';
import * as Burnt from "burnt";

export default function VideoCard({ item }: { item: Course }) {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Raleway_600SemiBold,
        Nunito_600SemiBold
    })

    const [dateCreated, setDateCreated] = useState("");
    const [time, setTime] = useState("");
    const [loadingBuyBtn, setLoadingBuyBtn] = useState(false);
    const [isBuy, setIsBuy] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        const date = new Date(item.cdate);

        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        setDateCreated(formattedDate);
    }, [])

    useEffect(() => {
        item.students.map((student, index) => {
            if(student.user_id == user?.id) {
                setIsBuy(true);
            }
        })
    }, [item, user])
    
    const onBuyCourse = async () => {
        const token = await AsyncStorage.getItem("access_token");
        setLoadingBuyBtn(true);
        console.log(`${SERVER_URI}/api/Course/BuyCourse?courseId=${item._id}`);
        await axios
            .post(`${SERVER_URI}/api/Course/BuyCourse?courseId=${item._id}`, {
                headers: {
                    "Cookie": token?.toString()
                },
            })
            .then((res: any) => {
                setLoadingBuyBtn(false);
                setIsBuy(true);
                Toast.show("Đã mua khóa học", {
                    type: "success",
                    duration: 1500
                })
            })
            .catch((error: any) => {
                setLoadingBuyBtn(false);
                console.log("Error buy course: " + error);
            })
    }

    const notify = () => {
        Burnt.toast({
            title: "Congrats!", // required
          
            preset: "done", // or "error", "none", "custom"
          
            message: "", // optional
          
            haptic: "success", // or "success", "warning", "error"
          
            duration: 2, // duration in seconds
          
            shouldDismissByDrag: true,
          
            from: "top", // "top" or "bottom"
          
            // optionally customize layout
            layout: {
              iconSize: {
                height: 24,
                width: 24,
              },
            },
          });
      }

    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: "(routes)/course/course-detail",
                params: { courseId: item._id }
            })}
            style={styles.container}>
            <View style={{ paddingHorizontal: 10 }}>
                <Image
                    style={{
                        width: wp(86),
                        height: 190,
                        borderRadius: 5,
                        alignSelf: "center",
                        objectFit: "cover",
                    }}
                    source={{ uri: item.courseImage || "https://static-00.iconduck.com/assets.00/image-not-found-01-icon-2048x2048-95wsi7vg.png" }}
                />
                <View style={{ width: wp(85) }}>
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: "left",
                            marginTop: 10,
                            fontFamily: "Raleway_700Bold",
                            height: 48
                        }}
                    >
                        {item.title.length >= 55 ? item.title.substring(0, 55) + "..." :
                            item.title}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingBottom: 5,
                        marginTop: 15,
                        height: 30
                    }}
                >
                    <View style={{
                        flexDirection: "column",

                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Ionicons name="person" size={20} color={"#8A8A8A"} />
                            <Text style={{ fontSize: 18, fontFamily: "Nunito_400Regular", paddingLeft: 10 }}>
                                {item.cuser.user_name}
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"

                    }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons name="calendar" size={20} color={"#8A8A8A"} />
                            <Text style={{ fontFamily: "Nunito_400Regular", marginLeft: 5 }}>
                                {dateCreated}
                            </Text>
                        </View>

                    </View>
                </View>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <Ionicons name="pricetag" size={20} color={"#8A8A8A"} />
                    <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold", paddingLeft: 10 }}>
                        {item.price + " vnđ"}
                    </Text>
                    {/* <TouchableOpacity 
                        style={{padding: 10, backgroundColor: "yellow"}}
                        onPress={notify}    
                    >
                        <Text>CLICK ME</Text>
                    </TouchableOpacity> */}
                </View>
                {isBuy ? (
                    <View style={{
                        marginTop: 15,
                        paddingHorizontal: 20,
                        paddingVertical: 13,
                        borderRadius: 10,
                        flexDirection: "row",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "grey"
                    }}>
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 16,
                                fontFamily: "Nunito_700Bold",
                                marginLeft: 20
                            }}
                        >
                            Đã mua khóa học
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={onBuyCourse}
                        style={{
                            marginTop: 15,
                            paddingHorizontal: 20,
                            paddingVertical: 13,
                            backgroundColor: "#2865e3",
                            borderRadius: 10,
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        {loadingBuyBtn ? (
                            <ActivityIndicator size={'small'} />
                        ) : (
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "center",
                            }}>
                                <FontAwesome name="cart-arrow-down" color={"white"} size={18} />
                                <Text
                                    style={{
                                        color: "white",
                                        textAlign: "center",
                                        fontSize: 16,
                                        fontFamily: "Nunito_700Bold",
                                        marginLeft: 20
                                    }}
                                >
                                    Mua khóa học
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
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