import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function useUser() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    const [follower, setFollower] = useState();
    const [error, setError] = useState("");

    useEffect(() => {
        const subscription = async () => {
            const token = await AsyncStorage.getItem("access_token");

            await axios
                .get(`${SERVER_URI}/api/User`, {
                    headers: {
                        "Cookie": token?.toString()
                    },
                })
                .then((res:any) => {
                    setUser(res.data);
                    setLoading(false);
                    AsyncStorage.setItem("user_id", res.data.id);
                })
                .catch((error:any) => {
                    setError(error.message);
                    setLoading(false);
                    router.push("(routes)/auth/signin")
                    console.log("Error fetch user: " + error);
                })
        }
        subscription();
    }, [])

    return { loading, user, follower, error }
}
