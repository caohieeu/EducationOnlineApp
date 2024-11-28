import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';

import {
    useFonts,
    Raleway_700Bold,
    Raleway_600SemiBold,
} from '@expo-google-fonts/raleway';
import {
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_600SemiBold,
} from '@expo-google-fonts/nunito';
import VideoCard from '@/components/VideoCard';
import { useQueryRequest } from '@/utils/useQueryRequest';
import { useGetListVideo } from '@/hooks/useGetListVideo';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderScreen from '@/components/HeaderScreen';
import { useGetListVideoOfCurrentUser } from '@/hooks/useGetListVideoOfCurrentUser';

export default function VideoCurrentUserScreen() {
    const flatlistRef = useRef(null);
    const [page, setPage] = useState(1);
    const [dataVideo, setDataVideo] = useState<VideoSingle[]>([]);

    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Raleway_600SemiBold,
        Nunito_600SemiBold,
    });

    const { queryString, updateQueryState } = useQueryRequest({
        pageSize: 20,
        page,
    });

    const { data: videos, isFetched, isLoading, error } = useGetListVideoOfCurrentUser(queryString);

    const fetchNextData = () => {
        if (!isLoading && isFetched) {
            setPage(prevPage => prevPage + 1);
            updateQueryState({ page: page + 1 });
        }
    };

    useEffect(() => {
        if (videos?.data) {
            setDataVideo(prevData => [...prevData, ...videos.data]);
        }
    }, [videos]);

    return (
        <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
            <HeaderScreen titleHeader="Video của bạn" />
            <FlatList
                ref={flatlistRef}
                data={dataVideo}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <VideoCard item={item} />}
                contentContainerStyle={styles.courseList}
                showsVerticalScrollIndicator={false}
                onEndReached={fetchNextData}
                ListFooterComponent={() =>
                    isLoading ? <ActivityIndicator size="small" color="#2467EC" /> : null
                }
            />
            {/* <ActivityIndicator size="large" color="#2467EC" style={styles.loader} /> */}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    categoryFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        backgroundColor: '#E1E9F8',
        borderRadius: 20,
    },
    activeCategoryButton: {
        backgroundColor: '#2467EC',
    },
    categoryButtonText: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#000',
    },
    activeCategoryButtonText: {
        color: '#fff',
    },
    loader: {
        marginTop: 50,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontFamily: 'Nunito_600SemiBold',
    },
    courseList: {
        paddingHorizontal: 16,
    },
});
