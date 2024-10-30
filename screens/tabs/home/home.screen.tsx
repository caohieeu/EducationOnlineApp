import { ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/Header';
import SearchInput from '@/components/SearchInput';
import HomeBarSlider from '@/components/HomeBarSlider';
import useUser from '@/hooks/useUser';
import Loader from '@/loader/loader';
import AllCourse from '@/components/AllCourse';
import { useQueryRequest } from '@/utils/useQueryRequest';
import { useGetListVideo } from '@/hooks/useGetListVideo';
import VideoCard from '@/components/VideoCard';
import RecomendVideo from '@/components/RecomendVideo';

export default function HomeScreen() {
    const [page, setPage] = useState(1);
    const [dataVideo, setDataVideo] = useState<VideoSingle[]>([]);
    const { user, loading } = useUser();
    const { queryString, updateQueryState } = useQueryRequest({
        page: 1,
        pageSize: 10
    });
    const { data: videos, isFetched, isLoading } = useGetListVideo(queryString);

    const fetchNextData = () => {
        console.log("page: " + page)
        if (!isLoading && isFetched) {
            setPage((prevPage) => prevPage + 1);
            updateQueryState({ page: page + 1 });
        }
    };

    useEffect(() => {
        if (videos?.data) {
            setDataVideo((prevVideos) => [...prevVideos, ...videos.data]);
        }
    }, [videos]);

    return (
        <>
            {loading && page === 1 ? (
                <Loader />
            ) : (
                <LinearGradient
                    colors={["#E5ECF9", "#F6F7F9"]}
                    style={{ flex: 1, paddingTop: 50 }}
                >
                    <Header />
                    <FlatList
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
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        onEndReached={fetchNextData}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => (
                            isLoading ? (
                                <ActivityIndicator size="small" color="#0000ff" />
                            ) : null
                        )}
                    />
                </LinearGradient>
            )}
        </>
    );
}
