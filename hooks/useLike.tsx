import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function useLike(isLike:boolean, videoId:string) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    const [likes, setLikes] = useState();
    const [error, setError] = useState("");

    useEffect(() => {
        const subscription = async () => {
            const token = await AsyncStorage.getItem("access_token");

            if(token == null) {
                setLoading(false);
                return;
            }
            if(videoId) {
                await axios
                .get(`${SERVER_URI}/api/Video/updateVideoLike/${videoId}?isLike=${isLike}`, {
                    headers: {
                        "Cookie": token?.toString()
                    },
                })
                .then((res:any) => {
                    setLikes(res.data);
                    setLoading(false);
                    AsyncStorage.setItem("user_id", res.data.id);
                })
                .catch((error:any) => {
                    setError(error.message);
                    router.push("(routes)/auth/signin")
                    console.log("Error like video: " + error);
                })
            }
        }
        subscription();
    }, [])

    return { loading, user, likes, error }
}
