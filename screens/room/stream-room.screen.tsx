import { Button, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import HeaderScreen from '@/components/HeaderScreen'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Toast } from 'react-native-toast-notifications'
import * as ScreenOrientation from 'expo-screen-orientation';

const ChatItem = ({ chat }: { chat: Chat }) => {
    return (
        <View>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
                marginHorizontal: 15
            }}>
                <Image
                    source={{
                        //uri: currentUser?.avatarUrl ||
                        uri: chat.avatar
                    }}
                    style={{ width: 40, height: 40, borderRadius: 100 }} />
                <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 600, color: "#fff"}}>
                    {chat.name}
                </Text>
                <Text style={{
                    alignItems: "center",
                    color: "#fff"
                }}>
                    {chat.message}
                </Text>
                </View>
            </View>
        </View>
    )
}

export default function StreamRoomScreen() {
    const chats: Chat[] = [
        {
            id: "123",
            avatar: "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
            name: "Caohieeu",
            message: "Bài này khó qué",
        },
        {
            id: "124",
            avatar: "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
            name: "Caokay",
            message: "Bài này dễ qué",
        },
        {
            id: "1210",
            avatar: "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
            name: "Caokay",
            message: "Bài này dễ qué",
        },
        {
            id: "125",
            avatar: "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
            name: "Caokay",
            message: "Bài này dễ qué",
        },
        {
            id: "126",
            avatar: "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
            name: "Caokay",
            message: "Bài này dễ qué",
        },
        {
            id: "127",
            avatar: "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
            name: "Caokay",
            message: "Bài này dễ qué",
        },
        {
            id: "128",
            avatar: "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
            name: "Caokay",
            message: "Bài này dễ qué",
        }
    ]
    const videoRef = useRef<Video>(null);
    const isFullscreenRef = useRef(false);
    var url = "https://d3k01n3i64ka9c.cloudfront.net/66d7f5a1b40af52e9130f798";
    const [activeButton, setActiveButton] = useState("Detail");
    const [onMic, setOnMic] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const setOrientationToLandscape = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      };
    
      const setOrientationToPortrait = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };

      const handleFullscreenUpdate = (event: any) => {
        console.log("Fullscreen update event:", event.fullscreenUpdate);
        
        if (event.fullscreenUpdate === 1 && !isFullscreen) {
            console.log("Entering fullscreen");
            setOrientationToLandscape();
            setIsFullscreen(true);
        } else if (event.fullscreenUpdate === 0 && isFullscreen) {
            console.log("Exiting fullscreen");
            setOrientationToPortrait();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // video.setOnFullscreenUpdate(handleFullscreenUpdate);
        }
    
        return () => {
            if (video) {
                // video.setOnFullscreenUpdate(null); // Hủy đăng ký
            }
        };
    }, []);

    useEffect(() => {
        try {
            if (videoRef.current) {
                videoRef.current.playAsync();
            }
        } catch (err) {
            Toast.show("Lỗi khi tải video lên", {
                type: "error",
                duration: 1400
            })
            console.log(err);
        }
    }, [url])

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={["#000000d6", "#000000d6"]}
                style={{ flex: 1 }}
            >
                <HeaderScreen titleHeader='Xem video' styleHeader='white' />
                    <Video
                    ref={videoRef}
                    source={{ uri: "https://watching.hightfive.click/hls/quoc/index.m3u8" || "" }}
                    style={styles.video}
                    resizeMode={ResizeMode.STRETCH}
                    useNativeControls
                    isLooping
                    onFullscreenUpdate={() => console.log("click full screen")}
                />
                {/* <Button title="Fullscreen" onPress={setOrientationToLandscape} />
                <Button title="Exit Fullscreen" onPress={setOrientationToPortrait} /> */}
                <View style={{
                    paddingHorizontal: 15
                }}>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: "Nunito_700Bold",
                        fontWeight: "bold",
                        marginTop: 20,
                        color: 'white'
                    }}>
                        {"Video Stream"}
                    </Text>
                    <Text
                        style={{
                            fontFamily: "Nunito_400Regular",
                            color: "#fff",
                            marginTop: 15,
                        }}
                    >
                        {"Đây là video live stream của giảng viên môn học: Lập trình đa nền tảng"}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginTop: 25,
                            backgroundColor: "#E1E9F8",
                            borderRadius: 50,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 42,
                                backgroundColor:
                                    activeButton === "Detail" ? "#2467EC" : "transparent",
                                borderRadius: activeButton === "Detail" ? 50 : 0,
                            }}
                            onPress={() => setActiveButton("Detail")}
                        >
                            <Text
                                style={{
                                    color: activeButton === "Detail" ? "#fff" : "#000",
                                    fontFamily: "Nunito_600SemiBold",
                                }}
                            >
                                Chi tiết
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 42,
                                backgroundColor:
                                    activeButton === "Chat" ? "#2467EC" : "transparent",
                                borderRadius: activeButton === "Chat" ? 50 : 0,
                            }}
                            onPress={() => setActiveButton("Chat")}
                        >
                            <Text
                                style={{
                                    color: activeButton === "Chat" ? "#fff" : "#000",
                                    fontFamily: "Nunito_600SemiBold",
                                }}
                            >
                                Trò chuyện
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 42,
                                backgroundColor:
                                    activeButton === "Student" ? "#2467EC" : "transparent",
                                borderRadius: activeButton === "Student" ? 50 : 0,
                            }}
                            onPress={() => setActiveButton("Student")}
                        >
                            <Text
                                style={{
                                    color: activeButton === "Student" ? "#fff" : "#000",
                                    fontFamily: "Nunito_600SemiBold",
                                }}
                            >
                                Học viên
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {activeButton == "Detail" && (
                        <View style={{
                            marginLeft: 5,
                            marginTop: 7,
                            justifyContent: "space-around",
                            flexDirection: "row"
                        }}>
                            {/* <Text style={{
                                fontFamily: "Nunito_700Bold",
                                fontSize: 20,
                            }}>
                                Chi tiết khóa học
                            </Text> */}
                            {/* <Text style={{
                                marginTop: 5,
                                fontFamily: "Nunito_600SemiBold",
                                fontSize: 16,
                                opacity: 0.7
                            }}>
                                asdsad
                            </Text> */}
                            <TouchableOpacity
                                style={styles.raiseHand}
                                onPress={() => console.log("Click")}
                            >
                                <FontAwesome
                                        name='hand-paper-o'
                                        size={40}
                                    />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.micro}
                                onPress={() => setOnMic(!onMic)}
                            >
                                {!onMic ? (
                                    <FontAwesome
                                        name='microphone'
                                        size={40}
                                    />
                                ) : (
                                    <FontAwesome
                                        name='microphone-slash'
                                        size={40}
                                    />
                                )}
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.exitRoom}
                                onPress={() => console.log("Click")}
                            >
                                <FontAwesome
                                        name='phone'
                                        size={40}
                                    />
                            </TouchableOpacity>
                        </View>
                    )}
                    {activeButton == "Chat" && (
                        <View style={{
                            marginTop: 15,
                        }}>
                            <FlatList
                                ref={null}
                                style={{ height: 248 }}
                                data={chats}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => <ChatItem chat={item} />}
                            />
                            <View style={{ position: 'absolute', bottom: -69, left: 0, right: 0, padding: 10 }}>
                                <TextInput
                                    style={[styles.chatBox]}
                                    placeholder='Nhập tin nhắn'>
                                </TextInput>
                                <TouchableOpacity>
                                    <FontAwesome
                                        style={styles.iconSend}
                                        name='paper-plane'
                                        size={18}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    chatBox: {
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#575757",
        fontSize: 17
    },
    iconSend: {
        position: "absolute",
        top: -30,
        right: 20,
    },
    micro: {
        width: 70,
        height: 70,
        padding: 10,
        borderRadius: 50,
        flexDirection: "column",
        alignSelf: "center",
        marginTop: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    exitRoom: {
        width: 70,
        height: 70,
        padding: 10,
        borderRadius: 50,
        borderColor: "#575757",
        borderWidth: 1,
        flexDirection: "column",
        alignSelf: "center",
        marginTop: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ee5550"
    },
    raiseHand: {
        width: 70,
        height: 70,
        padding: 10,
        borderRadius: 50,
        borderColor: "#575757",
        borderWidth: 1,
        flexDirection: "column",
        alignSelf: "center",
        marginTop: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff"
    },
    video: {
        width: '100%',
        height: 230,
        backgroundColor: 'white'
    },
})