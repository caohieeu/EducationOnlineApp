import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useComment(moduleId: string, page: number, refreshComments: number) {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem("access_token");
                const response = await axios.get(
                    `${SERVER_URI}/api/Video/GetComment?moduleId=${moduleId}&page=${page}&pageSize=25`,
                    {
                        headers: {
                            "Cookie": token?.toString()
                        }
                    }
                );
                setComments(response.data.data);
            } catch (error: any) {
                setError(error.message);
                console.log("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [moduleId, page, refreshComments]);

    return { loading, comments, error };
}
