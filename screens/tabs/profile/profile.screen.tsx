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
    const { following, refreshFollowing, fetchFollowing } = useFollowing(userId);
    const { currentUser, loading } = useCurrentUser(userId);
    const [isFollow, setIsFollow] = useState(false);
    const [followingNumber, setFollowingNumber] = useState<Follow[]>([]);

    useEffect(() => {
        const isUserFollowed = follower?.some(
            (item) =>
                item.follower.user_id === userInfo?.id &&
                item.followed.user_id === currentUser?.id
        );
        setIsFollow(!!isUserFollowed);
    }, [follower, userInfo]);

    useEffect(() => {
        setFollowingNumber(following || []);
    }, [following])

    onfocus = (payload) => {
        setFollowingNumber(following || []);
    }

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const logoutHandler = async () => {
        try {
            await AsyncStorage.multiRemove(["access_token", "user_id"]);
        }
        catch {
            Toast.show("Đăng xuất lỗi", {
                type: 'error',
                duration: 1400,
            });
        }
        finally {
            router.push('/(routes)/auth/signin');
        }
    };

    const onFollow = async () => {
        try {
            console.log(currentUser?.id)
            const token = await AsyncStorage.getItem("access_token");
            await axios.post(`${SERVER_URI}/api/Follow/PostFollow`, {
                user_id: currentUser?.id
            }, {
                headers: {
                    "Cookie": token?.toString()
                  }
            });

            Toast.show('Follow succeeded', {
                type: 'success',
                duration: 1400,
            });
            setIsFollow(true);
            refreshFollowing();
        } catch (error) {
            console.error('Error when posting follow:', error);
            Toast.show('Error while following', {
                type: 'danger',
                duration: 1400,
            });
        }
    };

    const onUnFollow = async () => {
        try {
            const followId = follower?.find(
                (item) =>
                    item.follower.user_id === userInfo?.id &&
                    item.followed.user_id === currentUser?.id
            )?.id;

            if (followId) {
                await axios.delete(`${SERVER_URI}/api/Follow/RemoveFollow/${followId}`);

                Toast.show('Unfollow succeeded', {
                    type: 'success',
                    duration: 1400,
                });
                setIsFollow(false);
                refreshFollowing();
            }
        } catch (error) {
            console.error('Error when removing follow:', error);
            Toast.show('Error while unfollowing', {
                type: 'danger',
                duration: 1400,
            });
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <LinearGradient
                    colors={["#E5ECF9", "#F6F7F9"]}
                    style={{ flex: 1, paddingTop: 60 }}
                >
                    <ScrollView>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <View style={{ position: "relative" }}>
                                <Image
                                    source={{
                                        uri: currentUser?.avatarUrl ||
                                            "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                    }}
                                    style={{ width: 80, height: 80, borderRadius: 100 }} />
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
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20
                        }}>
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: "(routes)/follow/following",
                                        params: { id: userId }
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
                                }}>Đang theo dõi</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push({
                                    pathname: "(routes)/follow/follower",
                                    params: { id: userId }
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
                                }}>Người theo dõi</Text>
                            </TouchableOpacity>
                        </View>
                        {currentUser?.userName == userInfo?.userName ? (
                            // user info
                            <View
                                style={{ marginHorizontal: 20, marginTop: 30 }}
                            >
                                <Text style={{
                                    fontSize: 20,
                                    marginBottom: 16,
                                    fontFamily: "Raleway_700Bold"
                                }}>
                                    Chi tiết tài khoản
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
                                                style={{ alignSelf: "center" }}
                                                name="user-o"
                                                size={20}
                                                color={"black"} />
                                        </View>
                                        <View>
                                            <Text
                                                style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}
                                            >
                                                Hồ sơ chi tiết
                                            </Text>
                                            <Text
                                                style={{ color: "#575757", fontFamily: "Nunito_400Regular" }}
                                            >
                                                Thông tin tài khoản
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity>
                                        <AntDesign name="right" size={26} color={"#CBD5E0"} />
                                    </TouchableOpacity>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => router.push("(routes)/profile-other/teacher-courses")}
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
                                                style={{ alignSelf: "center" }}
                                                name="book-account-outline"
                                                size={20}
                                                color={"black"} />
                                        </View>
                                        <View>
                                            <Text
                                                style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}
                                            >
                                                Khóa học của bạn
                                            </Text>
                                            <Text
                                                style={{ color: "#575757", fontFamily: "Nunito_400Regular" }}
                                            >
                                                Tất cả khỏa hoc của bạn
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
                                                style={{ alignSelf: "center" }}
                                                name="log-out-outline"
                                                size={20}
                                                color={"black"} />
                                        </View>
                                        <View>
                                            <Text
                                                style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}
                                            >
                                                Đăng xuất
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
                                                marginHorizontal: 154,
                                                borderWidth: 1,

                                            }}
                                        >
                                            <Text style={commonStyles.buttonText_2}>Đang theo dõi</Text>
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
                                            <Text style={commonStyles.buttonText}>Theo dõi</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <View
                                    style={{ marginHorizontal: 20, marginTop: 30 }}
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
        bottom: 5,
        width: 30,
        height: 30,
        backgroundColor: "#f5f5f5",
        borderRadius: 100,
        flexDirection: "row",
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