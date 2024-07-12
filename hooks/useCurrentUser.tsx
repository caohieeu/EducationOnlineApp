import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function useCurrentUser(followId:any) {
    const [currentUser, setCurrentUser] = useState<InfoUser>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAuthUser = async () => {
            const token = await AsyncStorage.getItem("access_token");

            await axios
                .get(`${SERVER_URI}/api/User`, {
                    headers: {
                        "Cookie": token?.toString()
                    },
                })
                .then((res:any) => {
                    setCurrentUser(res.data);
                    setLoading(false);
                    AsyncStorage.setItem("user_id", res.data.id);
                })
                .catch((error:any) => {
                    setError(error.message);
                    setLoading(false);
                    router.push("(routes)/auth/signin")
                    console.log("Error fetch user: " + error);
                })
        };
        const fetchUserById = async (id:any) => {
            await axios.get(
                `${SERVER_URI}/api/User/${id.toString()}`
            )
            .then((res:any) => {
                setCurrentUser(res.data);
                setLoading(false);
            })
            .catch((error:any) => {
                setLoading(false);
                console.log("Error when fetch user by id: " + error);
            })
            }
        if(followId == undefined) {
            fetchAuthUser();
        }
        else {
            fetchUserById(followId);
        }
    }, [])

    return { currentUser, loading }
}
