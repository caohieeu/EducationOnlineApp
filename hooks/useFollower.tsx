import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useOtherUser from './useOtherUser';

export default function useFollower(otherUserId:any) {
    const [loading, setLoading] = useState(true);
    const [follower, setFollower] = useState<Follow[]>();

    const fetchFollower = async () => {
        var currentUser = null;
        if(otherUserId == undefined) {
            currentUser = await AsyncStorage.getItem("user_id");
        }
        else {
            currentUser = otherUserId;
        }

        await axios.get(
            `${SERVER_URI}/api/Follow/GetFollower/${currentUser}?page=1&pageSize=26`
        )
        .then((res:any) => {
            setFollower(res.data.data);
            setLoading(false);
        })
        .catch((error:any) => {
            console.log(error);
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchFollower();
    }, [])

    return { loading, follower }
}
