import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function useOtherUser(otherUserId:any) {
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState<InfoUser>();
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserById = async (followId:string) => {
            await axios.get(
                `${SERVER_URI}/api/User/${followId}`
            )
            .then((res:any) => {
                setOtherUser(res.data);
                setLoading(false);
            })
            .catch((error:any) => {
                setLoading(false);
                console.log("Error when fetch user by id: " + error);
            })
            }
            fetchUserById(otherUserId);
    }, [])

    return { loading, otherUser, error }
}
