import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import HeaderScreen from '@/components/HeaderScreen'
import MyVideoPlayer from '@/components/MyVideoPlayer'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, Ionicons } from '@expo/vector-icons'

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
                <Text style={{fontWeight: 600}}>
                    {chat.name}
                </Text>
                <Text style={{
                    alignItems: "center",
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
    const url = "https://d3k01n3i64ka9c.cloudfront.net/66d7f5a1b40af52e9130f798";
    const [activeButton, setActiveButton] = useState("Detail");
    const [onMic, setOnMic] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            {/* {videoInfo != "" && videoInfo != null ? (
        <MyVideoPlayer videoInfo={JSON.stringify(videoInfo)} />
      ) : (
        <Text>Video not found</Text>
      )} */}

            <LinearGradient
                colors={["#E5ECF9", "#F6F7F9"]}
                style={{ flex: 1 }}
            >
                <HeaderScreen titleHeader='Xem video' />
                <View style={{ height: 230, width: "100%" }}>

                </View>
                <View style={{
                    paddingHorizontal: 15
                }}>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: "Nunito_700Bold",
                        fontWeight: "bold"
                    }}>
                        {"Video Stream"}
                    </Text>
                    <Text
                        style={{
                            fontFamily: "Nunito_400Regular",
                            color: "#757575",
                            marginTop: 15
                        }}
                    >
                        {"Đây là video live stream của giảng viên môn học: Lập trình đa nền tảng"}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginTop: 25,
                            marginHorizontal: 16,
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
                                style={styles.exitRoom}
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
                                        color={"white"}
                                        name='microphone'
                                        size={40}
                                    />
                                ) : (
                                    <FontAwesome
                                        color={"white"}
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
                                        name='sign-out'
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
        backgroundColor: "#f04345"
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
    }
})