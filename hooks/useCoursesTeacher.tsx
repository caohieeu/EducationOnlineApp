import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useCoursesTeacher(page: number, idTeacher: string) {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[]>();
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = await AsyncStorage.getItem("access_token");
                if (idTeacher) {
                    const response = await axios.get(
                        `${SERVER_URI}/api/Course/GetUserCourses/${idTeacher}?page=${page}&pageSize=25`,
                        {
                            headers: {
                                "Cookie": token?.toString(),
                            },
                        }
                    );
                    setCourses(response.data.data);
                }
            } catch (error: any) {
                setError(error.message);
                console.log("Error fetch courses: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [page, idTeacher]);

    return { loading, courses, error }
}
