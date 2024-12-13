import { Button, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import HeaderScreen from '@/components/HeaderScreen'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'
import { Toast } from 'react-native-toast-notifications'
import * as ScreenOrientation from 'expo-screen-orientation'
import { router, useLocalSearchParams } from 'expo-router'
import { HLS_URI, SERVER_URI } from '@/utils/uri'
import axios from 'axios'
import { useRemoveFromRoom } from '@/hooks/useRemoveFromRoom'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useSignalRConnection from '@/hooks/useSignalRConnection'
import useUser from '@/hooks/useUser'
import { useSignalRContext } from '@/hooks/useSignalRContext'

const AttendeeItem = ({ user }: { user: Attendee }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Image source={{ uri: user.user_avatar || "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg"}} style={{ width: 40, height: 40, borderRadius: 100 }} />
            <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: '600', color: '#fff' }}>{user.user_name}</Text>
            </View>
        </View>
    )
}

export default function StreamRoomScreen() {
    const {user} = useUser();
    const ChatLiveCallBack = () => {
        onGetChat();
    };
    const contextValue = useSignalRConnection("edunimohub", {
        userId: user?.id,
        onChatLiveCallBack: ChatLiveCallBack
    }    
    );
    const { roomId } = useLocalSearchParams()
    const { mutate: removeUser } = useRemoveFromRoom()
    const [urlVideo, setUrlVideo] = useState('')
    const [room, setRoom] = useState(null)
    const [textMessage, setTextMessge] = useState<SendMessageModel>({
        room_id: roomId?.toString() || "", 
        userAvatar: user?.avatarUrl,
        userName: user?.userName,
        content: "",
        userId: user?.id
    }
    );
    const [roomInfo, setRoomInfo] = useState<RoomModel>();
    const [chats, setChats] = useState<Chat[]>([]);

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
                        source={{ uri: chat.userAvatar || 
                            "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg"}} 
                        style={{ width: 40, height: 40, borderRadius: 100 }} 
                    />
                    <View style={{marginLeft: 10}}>
                    <Text style={{fontWeight: 600, color: "white"}}>
                        {chat.userName}
                    </Text>
                    <Text style={{
                        alignItems: "center",
                        color: "white"
                    }}>
                        {chat.content}
                    </Text>
                    </View>
                </View>
            </View>
        )
    }
    
    const videoRef = useRef<Video>(null)
    const [activeButton, setActiveButton] = useState('Detail')
    const [onMic, setOnMic] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    
    const setOrientationToLandscape = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    }

    const setOrientationToPortrait = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    }

    const handleFullscreenUpdate = (event: any) => {
        if (event.fullscreenUpdate === 1 && !isFullscreen) {
            setOrientationToLandscape()
            setIsFullscreen(true)
        } else if (event.fullscreenUpdate === 0 && isFullscreen) {
            setOrientationToPortrait()
            setIsFullscreen(false)
        }
    }

    const GetRoomDetail = async () => {
        await axios.get(`${SERVER_URI}/api/Room/${roomId}`).then((res) => {
            setUrlVideo(`${HLS_URI}/${res.data.entity.room.videoUrl}/index.m3u8`)
            setRoom(res.data.entity.room)
        }).catch((err) => {
            console.log(err)
        })
    }

    const EndCallHandle = async () => {
        const value: RemoveFromRoomMOdel = {
            roomId: room?.roomKey,
            userId: '',
            cmd: '',
        }
    
        await removeUser(value, {
            onSuccess: async (response: any) => {
                if (response === true) {
                    await videoRef.current?.stopAsync()
                    router.push('/')
                }
            },
        })
    }

    const onGetChat = async () => {
        await axios.get(`${SERVER_URI}/api/Room/GetChat/${roomId}`)
            .then((res) => {
                console.log(res.data.data[0])
                var lstChat = res.data.data;
                setChats(lstChat);
            })
            .catch((err) => {
                console.log("Error when get chat: " + err);
            })
        
    }

    const onSendChat = async (message:SendMessageModel) => {
        const token = await AsyncStorage.getItem("access_token");
        
        console.log(textMessage)
        await axios.post(`${SERVER_URI}/api/Room/SendChat`, message, {
            headers: {
            "Cookie": token?.toString()
            }
        })
        .then((res) => {
            console.log("Send success");
        })
        .catch((err) => {
            console.log("Error when send chat: " + err);
        });
    }

    useEffect(() => {
        GetRoomDetail()

        return () => {
            console.log('Component Unmount')
        }
    }, [])

    useEffect(() => {
        try {
            if (videoRef.current) {
                videoRef.current.playAsync()
            }
        } catch (err) {
            Toast.show('Lỗi khi tải video lên', { type: 'error', duration: 1400 })
            console.log(err)
        }
    }, [urlVideo])

    const fetchRoom = async () => {
        await axios.get(`${SERVER_URI}/api/Room/${roomId}`)
        .then((res) => {
            console.log(res.data.entity);
            setRoomInfo(res.data.entity)
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchRoom();
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={['#000000d6', '#000000d6']} style={{ flex: 1 }}>
                <HeaderScreen titleHeader="Xem video" styleHeader="white" />
                <Video
                    ref={videoRef}
                    source={{ uri: urlVideo || '' }}
                    style={styles.video}
                    resizeMode={ResizeMode.STRETCH}
                    useNativeControls
                    isLooping
                    onFullscreenUpdate={handleFullscreenUpdate}
                />
                <View style={{ paddingHorizontal: 15 }}>
                    <Text style={styles.videoTitle}>{roomInfo?.room.roomTitle}</Text>
                    <Text style={styles.videoDescription}>
                        {`Đây là video trực tiếp của giảng viên: ${roomInfo?.room.owner.user_name}`} 
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, activeButton === 'Detail' && styles.activeButton]}
                            onPress={() => setActiveButton('Detail')}
                        >
                            <Text style={[styles.buttonText, activeButton === 'Detail' && styles.activeButtonText]}>
                                Chi tiết
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, activeButton === 'Student' && styles.activeButton]}
                            onPress={() => setActiveButton('Student')}
                        >
                            <Text style={[styles.buttonText, activeButton === 'Student' && styles.activeButtonText]}>
                                Học viên
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, activeButton === 'Chat' && styles.activeButton]}
                            onPress={() => setActiveButton('Chat')}
                        >
                            <Text style={[styles.buttonText, activeButton === 'Chat' && styles.activeButtonText]}>
                                Tin nhắn
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {activeButton === 'Detail' && (
                        <View style={styles.detailSection}>
                            <TouchableOpacity style={styles.exitRoom} onPress={EndCallHandle}>
                                <FontAwesome name="phone" size={40} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {activeButton === 'Student' && (
                        <View style={{ marginTop: 15 }}>
                            <FlatList
                                ref={null}
                                style={{ height: 248 }}
                                data={roomInfo?.room.attendees}
                                keyExtractor={(item) => item.user_id.toString()}
                                renderItem={({ item }) => <AttendeeItem user={item} />}
                            />
                            {/* <View style={styles.chatInputContainer}>
                                <TextInput style={styles.chatBox} placeholder="Nhập tin nhắn" />
                                <TouchableOpacity>
                                    <FontAwesome style={styles.iconSend} name="paper-plane" size={18} />
                                </TouchableOpacity>
                            </View> */}
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
                                keyExtractor={(item) => item._id.toString()}
                                renderItem={({ item }) => <ChatItem chat={item} />}
                            />
                            <View style={{ position: 'absolute', bottom: -69, left: 0, right: 0, padding: 10 }}>
                                <TextInput
                                    value={textMessage.content}
                                    onChangeText={(text) => 
                                        setTextMessge({
                                            ...textMessage, 
                                            room_id: "675aecf3ea3482a4e6372b4e", 
                                            userAvatar: user?.avatarUrl,
                                            userName: user?.userName,
                                            userId: user?.id,
                                            content: text
                                        })
                                    }
                                    style={[styles.chatBox]}
                                    placeholder='Nhập tin nhắn'
                                    placeholderTextColor={'white'}>
                                </TextInput>
                                <TouchableOpacity
                                    onPress={() => onSendChat(textMessage)}
                                >
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
    video: {
        width: '100%',
        height: 220,
        marginTop: 10,
    },
    videoTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 20,
    },
    videoDescription: {
        fontSize: 16,
        color: '#fff',
        marginTop: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
        backgroundColor: '#E1E9F8',
        borderRadius: 50,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 42,
        backgroundColor: 'transparent',
        borderRadius: 0,
    },
    activeButton: {
        backgroundColor: '#2467EC',
        borderRadius: 50,
    },
    buttonText: {
        color: '#000',
        fontFamily: 'Nunito_600SemiBold',
    },
    activeButtonText: {
        color: '#fff',
    },
    detailSection: {
        marginLeft: 5,
        marginTop: 7,
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    exitRoom: {
        padding: 15,
        backgroundColor: '#E1E9F8',
        borderRadius: 50,
    },
    chatInputContainer: {
        position: 'absolute',
        bottom: -69,
        left: 0,
        right: 0,
        padding: 10,
    },
    chatBox: {
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        fontSize: 17,
        color: "white"
    },
    iconSend: {
        position: 'absolute',
        top: -30,
        right: 20,
        color: "white"
    },
})

