import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useFollowing(otherUserId:any) {
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState<Follow[]>();

    const fetchFollowing = async () => {
        var currentUser = null;
        if(otherUserId == undefined) {
            currentUser = await AsyncStorage.getItem("user_id");
        }
        else {
            currentUser = otherUserId;
        }

        await axios.get(
            `${SERVER_URI}/api/Follow/GetFollowing/${currentUser}?page=1`
        )
        .then((res:any) => {
            setFollowing(res.data);
            setLoading(false);
        })
        .catch((error:any) => {
            console.log(error);
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchFollowing();
    }, [otherUserId ,loading, following])

    return { loading, following }
}
