import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import useInfoUser from '@/hooks/useInfoUser';
import Loader from '@/loader/loader';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { commonStyles } from '@/styles/common';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import useFollower from '@/hooks/useFollower';
import useCurrentUser from '@/hooks/useCurrentUser';
import useFollowing from '@/hooks/useFollowing';
import { Toast } from 'react-native-toast-notifications';

export default function ProfileScreen() {
    const { userId } = useLocalSearchParams();

    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Raleway_600SemiBold,
        Nunito_600SemiBold
    })
    const { userInfo } = useInfoUser();
    const { follower } = useFollower(userId);
    const { following  } = useFollowing(userId);
    const { currentUser, loading } = useCurrentUser(userId);
    const [followedId, setFollowId] = useState();
    const [followerId, setFollowerId] = useState();
    const [isFollow, setIsFollow] = useState(false);

    useEffect(() => {
        follower?.map((item) => {
            if((item.follower.user_id == userInfo?.id) && 
            (item.followed.user_id == currentUser?.id)) {
                setIsFollow(true);
                return;
            }
        })
    }, [follower, userInfo, currentUser])

    if(!fontsLoaded && !fontError) {
        return null;
    }
    
    const logoutHandler = () => {
        AsyncStorage.multiRemove(["access_token", "user_id"]);
        router.push("/(routes)/auth/signin")
    }

    const onFollow = async () => {
        await axios.post(
            `${SERVER_URI}/api/Follow/PostFollow`,
            {
                followed: {
                  user_id: currentUser?.id,
                  user_display_name: currentUser?.dislayName,
                  user_avatar: currentUser?.avatarUrl
                },
                follower: {
                  user_id: userInfo?.id,
                  user_display_name: userInfo?.dislayName,
                  user_avatar: userInfo?.avatarUrl
                }
              }
        )
        .then((res:any) => {
            Toast.show("Follow successed", {
                type:"success",
                duration: 1400
            })
            setIsFollow(!isFollow);
        })
        .catch((error:any) => {
            console.log("Error when post follow: " + error);
        })
    }
    
    const findIdFollow = () => {
        const foundItem = follower?.find((item) => 
            item.follower.user_id == userInfo?.id && 
            item.followed.user_id == currentUser?.id
        );
        if(foundItem) {
            setIsFollow(true);
            console.log("id: " + foundItem.id);
            return foundItem.id;
        }
    }

    const onUnFollow = async () => {
        const id = findIdFollow();
        console.log(`${SERVER_URI}/api/Follow/RemoveFollow/${id}`);
        await axios.delete(
            `${SERVER_URI}/api/Follow/RemoveFollow/${id}`
        )
        .then((res:any) => {
            Toast.show("Un follow successed", {
                type:"success",
                duration: 1400
            })
            setIsFollow(!isFollow);
        })
        .catch((error:any) => {
            console.log("Error when post follow: " + error);
        })
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <LinearGradient
                    colors={["#E5ECF9", "#F6F7F9"]} 
                    style={{flex: 1, paddingTop: 60}}
                >
                <ScrollView>
                    <View style={{flexDirection: "row", justifyContent: "center"}}>
                        <View style={{position: "relative"}}>
                            <Image 
                                source={{uri: currentUser?.avatarUrl || 
                                    "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                }}
                                style={{width: 80, height: 80, borderRadius: 100}} />
                            <TouchableOpacity
                                style={styles.iconEditImage}
                            >
                                <Ionicons 
                                    name="camera-outline" size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.wrapperRole}>
                            <Text style={styles.textRole}>
                            {currentUser?.role}
                            </Text>
                        </View> 
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: -10,
                    }}>
                        <Text style={styles.textDisplayName}>
                            {currentUser?.dislayName}
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center" ,
                        alignItems: "center",
                        marginTop: 20
                    }}>
                        <TouchableOpacity
                            onPress={() => 
                                router.push({
                                    pathname: "(routes)/follow/following",
                                    params: {id: userId}
                                })
                            }
                            style={{
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 40
                            }}>
                            <Text style={{
                                fontFamily: "Nunito_700Bold",
                                fontWeight: 800,
                                fontSize: 18
                            }}>{following?.length}</Text>
                            <Text style={{
                                fontFamily: "Nunito_600SemiBold",
                                color: "#575757"
                            }}>Following</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={() => router.push({
                                pathname: "(routes)/follow/follower",
                                params: {id: userId}
                            })}
                            style={{
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            <Text style={{
                                fontFamily: "Nunito_700Bold",
                                fontWeight: 800,
                                fontSize: 18
                            }}>{follower?.length}</Text>
                            <Text style={{
                                fontFamily: "Nunito_600SemiBold",
                                color: "#575757"
                            }}>Follower</Text>
                        </TouchableOpacity>
                    </View>
                    {currentUser?.userName == userInfo?.userName ? (
                    // user info
                    <View
                        style={{marginHorizontal: 20, marginTop: 30}}
                    >
                        <Text style={{
                            fontSize: 20, 
                            marginBottom: 16, 
                            fontFamily: "Raleway_700Bold"
                        }}>
                            Account Details
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                router.push("(routes)/profile-detail")
                            }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 20
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: 30
                                }}
                            >
                                <View
                                    style={{
                                        borderWidth: 2,
                                        borderColor: "#dde2ec",
                                        padding: 15,
                                        borderRadius: 100,
                                        width: 55,
                                        height: 55
                                    }}
                                >
                                    <FontAwesome 
                                        style={{alignSelf: "center"}}
                                        name="user-o" 
                                        size={20} 
                                        color={"black"} />
                                </View>
                                <View>
                                    <Text
                                        style={{fontSize: 16, fontFamily: "Nunito_700Bold"}}
                                    >
                                        Detail Profile
                                    </Text>
                                    <Text
                                        style={{color: "#575757", fontFamily: "Nunito_400Regular"}}
                                    >
                                        Information Account
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <AntDesign name="right" size={26} color={"#CBD5E0"} />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 20
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: 30
                                }}
                            >
                                <View
                                    style={{
                                        borderWidth: 2,
                                        borderColor: "#dde2ec",
                                        padding: 15,
                                        borderRadius: 100,
                                        width: 55,
                                        height: 55
                                    }}
                                >
                                    <MaterialCommunityIcons 
                                        style={{alignSelf: "center"}}
                                        name="book-account-outline"
                                        size={20} 
                                        color={"black"} />
                                </View>
                                <View>
                                    <Text
                                        style={{fontSize: 16, fontFamily: "Nunito_700Bold"}}
                                    >
                                        Your Courses
                                    </Text>
                                    <Text
                                        style={{color: "#575757", fontFamily: "Nunito_400Regular"}}
                                    >
                                        All your courses
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <AntDesign name="right" size={26} color={"#CBD5E0"} />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={logoutHandler}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 20
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: 30
                                }}
                            >
                                <View
                                    style={{
                                        borderWidth: 2,
                                        borderColor: "#dde2ec",
                                        padding: 15,
                                        borderRadius: 100,
                                        width: 55,
                                        height: 55
                                    }}
                                >
                                    <Ionicons 
                                        style={{alignSelf: "center"}}
                                        name="log-out-outline"
                                        size={20} 
                                        color={"black"} />
                                </View>
                                <View>
                                    <Text
                                        style={{fontSize: 16, fontFamily: "Nunito_700Bold"}}
                                    >
                                        Log out
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <AntDesign name="right" size={26} color={"#CBD5E0"} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                    // end detail profile
                    ) : (
                        <View>
                            <View>
                            {isFollow ? (
                                <TouchableOpacity
                                onPress={onUnFollow}
                                style={{
                                    marginTop: 20,
                                    paddingVertical: 13,
                                    borderRadius: 8,
                                    marginHorizontal: 160,
                                    borderWidth: 1,
                                }}
                            >
                                <Text style={commonStyles.buttonText_2}>Following</Text>
                            </TouchableOpacity>
                            ) : (
                            <TouchableOpacity
                                onPress={onFollow}
                                style={{
                                    marginTop: 20,
                                    backgroundColor: "#2865e3",
                                    paddingVertical: 13,
                                    borderRadius: 8,
                                    marginHorizontal: 160
                                }}
                            >
                                <Text style={commonStyles.buttonText}>Follow</Text>
                            </TouchableOpacity>
                            )}
                        </View>
                        <View
                            style={{marginHorizontal: 20, marginTop: 30}}
                        >
                            <Text style={{
                                fontSize: 20, 
                                marginBottom: 16, 
                                fontFamily: "Raleway_700Bold"
                            }}>
                                Videos
                            </Text>
                        </View>
                        </View>
                    )}

                </ScrollView>
            </LinearGradient>
            )}
        </>
    )
}


const styles = StyleSheet.create({ 
    iconEditImage: {
        position: "absolute", 
        right: 0, 
        bottom:5,
        width: 30,
        height: 30,
        backgroundColor: "#f5f5f5",
        borderRadius: 100,
        flexDirection:"row",
        justifyContent: "center",
        alignItems: "center"
    },
    textDisplayName: {
        textAlign: "center", 
        fontSize: 25, 
        paddingTop: 10, 
        fontWeight: "600",
    },
    textRole: {
        textAlign: "center", 
        fontSize: 12,
        color: "#0000CD",
        fontFamily: "Raleway_600SemiBold"
    },
    wrapperRole: {
        marginTop: 4,
        padding: 6,
        marginHorizontal: 175,
        backgroundColor: "#ADD8E6", 
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 13,
    }
})