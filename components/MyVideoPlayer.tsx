import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { responsiveWidth } from "react-native-responsive-dimensions"
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
import { Video, ResizeMode } from 'expo-av';
import { Toast } from 'react-native-toast-notifications';

export default function MyVideoPlayer({ videoInfo }: { videoInfo: string }) {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Raleway_600SemiBold,
        Nunito_600SemiBold
    })
    const videoRef = useRef<Video>(null);
    const [video, setVideo] = useState<VideoSingle>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        var jsonObject = JSON.parse(videoInfo);
        setVideo(JSON.parse(jsonObject.toString()));

        try {
            if (videoRef.current) {
                videoRef.current.playAsync();
            }
            setLoading(false);
        } catch (err) {
            Toast.show("Lỗi khi tải video lên", {
                type: "error",
                duration: 1400
            })
            console.log(err);
        }
    }, [videoInfo])

    if(!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                video && (
                    <Video
                        ref={videoRef}
                        source={{ uri: video?.videoUrl || "" }}
                        style={styles.video}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                    />
                )
            )}
        </View>
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
    },
    video: {
        width: '100%',
        height: 230
    },
})