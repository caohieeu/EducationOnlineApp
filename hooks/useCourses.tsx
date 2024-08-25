import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';

export default function useCourses(page:number) {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[]>();
    const [error, setError] = useState("");

    useEffect(() => {
        const subscription = async () => {
            await axios
                .get(`${SERVER_URI}/api/Course/GetNewestCourses?page=${page}&pageSize=25`)
                .then((res:any) => {
                    setCourses(res.data.data);
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

    return { loading, courses, error }
}
