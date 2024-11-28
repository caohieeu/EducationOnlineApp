import { ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import MyVideoPlayer from '@/components/MyVideoPlayer';
import { useLocalSearchParams } from 'expo-router';
import HeaderScreen from '@/components/HeaderScreen';
import CommentSection from '@/components/CommentSection';
import { LinearGradient } from 'expo-linear-gradient';

import { useFonts } from '@expo-google-fonts/raleway';
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import RecomendVideo from '@/components/RecomendVideo';
import useGetVideoDetail from '@/hooks/useGetVideoDetail';
import useLike from '@/hooks/useLike';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '@/utils/AxiosConfig';

export default function VideoScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  const { videoInfo } = useLocalSearchParams();
  const [video, setVideo] = useState<VideoSingle>();
  const { loading, error } = useGetVideoDetail(video?.id || "");
  const [expanded, setExpanded] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isLiked, setIsLiked] = useState(false); 
  const [likes, setLikes] = useState(video?.like || 0);
  // const { likes } = useLike(isLike, video?.id || "")

  useEffect(() => {
    if (videoInfo) {
      const videoObj = JSON.parse(JSON.stringify(videoInfo));
      setVideo(JSON.parse(videoObj.toString()));
    }
  }, [videoInfo]);

  useEffect(() => {
    if (video) {
      setLikes(video.like || 0);
    }
  }, [video]);

  const fetchLikeStatus = async () => {
    const token = await AsyncStorage.getItem("access_token");
    console.log(`${SERVER_URI}/api/Video/updateVideoLike/${video?.id}?isLike=${isLike}`)
    await axios
      .put(`${SERVER_URI}/api/Video/updateVideoLike/${video?.id}?isLike=${isLike}`, {
          headers: {
              "Cookie": token?.toString()
          },
      })
      .then((res:any) => {
        setIsLiked(res.data.IsLike);
        setLikes(res.data.like);
      })
      .catch((error:any) => {
          console.log("Error like video: " + error);
      })
  }

  const handleLike = () => {
    if (video?.isLike) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    fetchLikeStatus();
    setIsLiked(!video?.isLike);
  };

  const formatUploadDate = (uploadDate: string) => {
    const now = new Date();
    const videoDate = new Date(uploadDate);
    const secondsAgo = Math.floor((now.getTime() - videoDate.getTime()) / 1000);

    if (secondsAgo < 60) return `${secondsAgo} giây trước`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo} phút trước`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo} giờ trước`;
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} ngày trước`;
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
        <HeaderScreen titleHeader="Xem video" />
        {videoInfo != "" && videoInfo != null ? (
          <MyVideoPlayer videoInfo={JSON.stringify(videoInfo)} />
        ) : (
          <Text>Video not found</Text>
        )}

        <ScrollView>
          {/* Container cho tiêu đề và thông tin */}
          <TouchableOpacity
            style={[styles.infoContainer, expanded && styles.infoContainerExpanded]}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={styles.title}>{video?.title}</Text>
            <Text style={styles.subInfo}>
              {`${video?.view || 0} lượt xem • ${formatUploadDate(
                video?.time instanceof Date ? video.time.toISOString() : video?.time || ''
              )}`}
            </Text>

            {/* Nút Like */}
            <View style={styles.likeContainer}>
            <TouchableOpacity
              style={[
                styles.likeButton,
                video?.isLike ? styles.likeButtonActive : styles.likeButtonInactive,
              ]}
              onPress={handleLike}
            >
              <Text style={[styles.likeText, isLiked && styles.likeTextActive]}>
                👍
              </Text>
              <Text style={[styles.likeCount, isLiked && styles.likeTextActive]}>
                {video?.like}
              </Text>
            </TouchableOpacity>
          </View>

            {/* Hiển thị chi tiết khi expanded */}
            {expanded && (
              <>
                {video?.tags?.length > 0 && (
                  <FlatList
                    data={video?.tags}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ marginTop: 10 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.tag}>
                        <Text style={styles.tagText}>#{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
                <Text style={styles.description}>{video?.description}</Text>

              {/* Phần bình luận */}
            <View style={styles.commentContainer}>
              <CommentSection moduleId={video?.id || 'defaultModuleId'} />
            </View>
              </>
            )}
          </TouchableOpacity>

          {/* Mô tả */}
          <View style={{ paddingHorizontal: 18 }}>
            {/* Video liên quan */}
            <RecomendVideo type="vertical" />

          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 18,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainerExpanded: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subInfo: {
    fontFamily: "Nunito_400Regular",
    color: "#757575",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  tagText: {
    fontFamily: "Nunito_400Regular",
    color: "#333",
  },
  description: {
    fontFamily: "Nunito_400Regular",
    color: "#757575",
    marginTop: 15,
  },
  commentContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentHeader: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#333",
    marginBottom: 10,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  likeButtonActive: {
    backgroundColor: "#FFD700", // Vàng khi đã like
  },
  likeButtonInactive: {
    backgroundColor: "#F0F0F0", // Xám khi chưa like
  },
  likeText: {
    fontSize: 18,
    marginRight: 8,
    fontFamily: "Nunito_400Regular",
  },
  likeTextActive: {
    color: "#FF4500", // Cam khi đã like
  },
  likeCount: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
});
