import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function useCourses(page:number) {
    const [loading, setLoading] = useState(true);
    const [videoCourses, setVideoCourses] = useState<VideoCourse[]>();
    const [error, setError] = useState("");

    useEffect(() => {
        const subscription = async () => {
            const token = await AsyncStorage.getItem("access_token");

            await axios
                .get(`${SERVER_URI}/api/Video/${page}`)
                .then((res:any) => {
                    setVideoCourses(res.data);
                    setLoading(false);
                })
                .catch((error:any) => {
                    setError(error.message);
                    setLoading(false);
                    console.log("Error fetch video: " + error);
                })
        }
        subscription();
    }, [])

    return { loading, videoCourses, error }
}
