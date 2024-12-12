import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Updates from 'expo-updates'; // Thay đổi import đúng
import Header from '@/components/Header';
import SearchInput from '@/components/SearchInput';
import HomeBarSlider from '@/components/HomeBarSlider';
import Loader from '@/loader/loader';
import AllCourse from '@/components/AllCourse';
import { useQueryRequest } from '@/utils/useQueryRequest';
import { useGetListVideo } from '@/hooks/useGetListVideo';
import VideoCard from '@/components/VideoCard';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import useUser from '@/hooks/useUser';
import useSignalRConnection from '@/hooks/useSignalRConnection';
import { Toast } from 'react-native-toast-notifications';

export default function HomeScreen() {
    const { user } = useUser();
    const [page, setPage] = useState(1);
    const [dataVideo, setDataVideo] = useState<VideoSingle[]>([]);
    const { queryString, updateQueryState } = useQueryRequest({
        page: 1,
        pageSize: 10,
    });

    const { data: videos, isFetched, isLoading } = useGetListVideo(queryString);

    const contextValue = useSignalRConnection("edunimohub", {
        userId: user?.id,
      });

    const [refreshing, setRefreshing] = useState(false); // State để quản lý pull to refresh

    // React.useEffect(() => {
    //     if (contextValue) {
    //         contextValue.off("roomRequest");
            
    //         contextValue.on("roomRequest", (message) => {
    //           console.log(message)
    //             if (message.res) {
    //                 router.push({
    //                     pathname: "(routes)/room/stream-room",
    //                     params: { roomId: message.roomId }
    //                 });
    //             }
    //         });
    
    //         contextValue.on("OnRoomRemoved", (message) => {
    //           console.log(message)
    //             if (message) {
    //                 // Toast.show("Bạn đã bị kick khỏi phòng", {
    //                 //     type: "warning",
    //                 //     duration: 1400
    //                 // });
    //                 router.push('/')
    //             }
    //         });
    //     }
    //     return () => {
    //         contextValue?.off("roomRequest");
    //     };
    // }, [contextValue]);

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

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1); // Đặt lại trang về 1 khi kéo xuống
        setDataVideo([]); // Xoá dữ liệu hiện tại để tải lại
        updateQueryState({ page: 1 }); // Cập nhật query string

        // Reload lại toàn bộ ứng dụng
        Updates.reloadAsync(); // Gọi reloadAsync từ expo-updates
    }, []);

    const Title = React.memo(() => (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: 10,
                marginTop: 10
            }}
        >
            <Text style={{ fontSize: 20, fontFamily: "Raleway_700Bold" }}>Video đề xuất</Text>
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: "(routes)/video/all-video",
                })}
            >
                <Text
                    style={{ fontSize: 15, color: "#2467EC", fontFamily: "Nunito_600SemiBold" }}
                >
                    Xem tất cả
                </Text>
            </TouchableOpacity>
        </View>
    ));

    const HeaderComponent = React.memo(() => (
        <>
            <SearchInput />
            <HomeBarSlider />
            <AllCourse />
            <Title />
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
                        ListFooterComponent={() => (
                            isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : null
                        )}
                        refreshing={refreshing} // Cập nhật trạng thái refreshing
                        onRefresh={handleRefresh} // Gọi hàm handleRefresh khi kéo xuống
                    />
                </LinearGradient>
            )}
        </>
    );
}
