import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function useFollowing(otherUserId:any) {
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState<Follow[]>();
    const [trigger, setTrigger] = useState(false);

    const fetchFollowing = useCallback(async () => {
        setLoading(true);

        let currentUser = otherUserId;

        if (currentUser === undefined) {
            currentUser = await AsyncStorage.getItem("user_id");
        }

        try {
            const res = await axios.get(
                `${SERVER_URI}/api/Follow/GetFollowing/${currentUser}?page=1&pageSize=26`
            );
            setFollowing(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [otherUserId, trigger]); 

    useFocusEffect(
        React.useCallback(() => {
            fetchFollowing();
        }, [fetchFollowing])
    );

    const refreshFollowing = () => {
        setTrigger(prevState => !prevState);
    };

    return { loading, following, refreshFollowing, fetchFollowing }
}
