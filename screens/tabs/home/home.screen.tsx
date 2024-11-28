import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/Header';
import SearchInput from '@/components/SearchInput';
import HomeBarSlider from '@/components/HomeBarSlider';
import Loader from '@/loader/loader';
import AllCourse from '@/components/AllCourse';
import { useQueryRequest } from '@/utils/useQueryRequest';
import { useGetListVideo } from '@/hooks/useGetListVideo';
import VideoCard from '@/components/VideoCard';
import RecomendVideo from '@/components/RecomendVideo';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

export default function HomeScreen() {
    const [page, setPage] = useState(1);
    const [dataVideo, setDataVideo] = useState<VideoSingle[]>([]);
    const { queryString, updateQueryState } = useQueryRequest({
        page: 1,
        pageSize: 10,
    });
    
    const { data: videos, isFetched, isLoading } = useGetListVideo(queryString);

    useFocusEffect(
        React.useCallback(() => {
            setPage(1);
            setDataVideo([]);
            updateQueryState({ page: 1 });
        }, [])
    );

    useEffect(() => {
        if (page > 1) {
            updateQueryState({ page });
        }
    }, [page]);
    
    useEffect(() => {
        if (videos?.data) {
            setDataVideo((prevVideos) => {
                const newVideos = videos.data.filter(
                    (video) => !prevVideos.some((prev) => prev.id === video.id)
                );
                return [...prevVideos, ...newVideos];
            });
        }
    }, [videos]);

    const fetchNextData = useCallback(() => {
        if (!isLoading && isFetched && videos?.data?.length > 0) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isLoading, isFetched, videos]);

    const Title = React.memo(() => (
        <>
            <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 10,
              marginTop: 10
            }}
          >
            <Text style={{fontSize: 20, fontFamily: "Raleway_700Bold"}}>Video đề xuất</Text>
            <TouchableOpacity
              onPress={() => router.push({
                pathname: "(routes)/video/all-video",
            })}
            >
              <Text
                style={{fontSize: 15, color: "#2467EC", fontFamily: "Nunito_600SemiBold"}}
              >
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
        </>
    ))

    const HeaderComponent = React.memo(() => (
        <>
            <SearchInput />
            <HomeBarSlider />
            <AllCourse />
            <Title />
            {/* <RecomendVideo type='horizontal' /> */}
        </>
    ));

    return (
        <>
            {isLoading && page === 1 ? (
                <Loader />
            ) : (
                <LinearGradient
                    colors={["#E5ECF9", "#F6F7F9"]}
                    style={{ flex: 1, paddingTop: 50 }}
                >
                    <Header />
                    <FlatList
                        style={{ marginHorizontal: 16, marginTop: 30 }}
                        data={dataVideo}
                        ListHeaderComponent={HeaderComponent}
                        renderItem={({ item }) => <VideoCard item={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        onEndReached={fetchNextData}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => (isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : null)}
                    />
                    {/* <FlatList
                        style={{
                            marginHorizontal: 16,
                            marginTop: 30,
                        }}
                        data={dataVideo}
                        ListHeaderComponent={() => (
                            <>
                                <SearchInput />
                                <HomeBarSlider />
                                <AllCourse />
                                <RecomendVideo type='horizontal' />
                            </>
                        )}
                        renderItem={({ item }) => <VideoCard item={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        onEndReached={fetchNextData}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => (
                            isLoading ? (
                                <ActivityIndicator size="small" color="#0000ff" />
                            ) : null
                        )}
                    /> */}
                </LinearGradient>
            )}
        </>
    );
}
