import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import useUser from './useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function useInfoUser() {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<InfoUser>();
    const [error, setError] = useState("");

    useEffect(() => {
        const subscription = async () => {
            const id = await AsyncStorage.getItem("user_id");

            await axios
                .get(`${SERVER_URI}/api/User/${id}`)
                .then((res:any) => {
                    setUserInfo(res.data);
                    setLoading(false); 
                })
                .catch((error:any) => {
                    setError(error.message);
                    setLoading(false);
                    router.push("(routes)/auth/signin")
                    console.log("Error fetch info user: " + error);
                })
        }
        subscription();
    }, [])

    return { loading, userInfo, error }
}
