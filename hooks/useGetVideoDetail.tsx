import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-notifications';

export default function useGetVideoDetail(videoId:string) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const subscription = async () => {
            const token = await AsyncStorage.getItem("access_token");
            if(videoId && token != "") {
                console.log(`${SERVER_URI}/api/Video/getVideo/${videoId}`)
            await axios
                .get(`${SERVER_URI}/api/Video/getVideo/${videoId}`, {
                    headers: {
                        "Cookie": token?.toString()
                    },
                })
                .then((res:any) => {
                    setLoading(false);
                    console.log(res.data)
                })
                .catch((error:any) => {
                    setError(error.message);
                    setLoading(false);
                    console.log("Error fetch get video detail: " + error);
                    Toast.show('Error fetch get video detail', {
                        type: 'error',
                        duration: 1400,
                    });
                })
            }
        }
        subscription();
    }, [videoId])

    return { loading, error }
}
