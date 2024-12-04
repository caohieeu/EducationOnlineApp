import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-notifications';

export default function useUpdateUser(userUpdate:UpdateUserModel) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const subscription = async () => {
        const token = await AsyncStorage.getItem("access_token");
        if(userUpdate) {
        await axios
            .put(`${SERVER_URI}/api/User/updateProfile`, userUpdate, {
                headers: {
                    "Cookie": token?.toString()
                },
            })
            .then((res:any) => {
                setLoading(false);
                Toast.show('Cập nhật thành công', {
                    type: 'success',
                    duration: 1400,
                });
            })
            .catch((error:any) => {
                setError(error.message);
                setLoading(false);
                console.log("Error update profile: " + error);
                Toast.show('Error update profile', {
                    type: 'error',
                    duration: 1400,
                });
            })
        }
    }

    return { loading, error, subscription }
}
