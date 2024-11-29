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
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { VideoDecoderProperties } from 'react-native-video';

export default function VideoScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  const { videoInfo } = useLocalSearchParams();
  const [idVideo, setIdVideo] = useState("");
  const [video, setVideo] = useState<VideoSingle | null>(null);
  const { loading, error, videoInfor } = useGetVideoDetail(idVideo || "");
  const [expanded, setExpanded] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isLiked, setIsLiked] = useState(false); 
  const [likes, setLikes] = useState(video?.like || 0);

  useEffect(() => {
    if (videoInfo) {
      const videoObj = JSON.parse(JSON.stringify(videoInfo));
      // setVideo(JSON.parse(videoObj.toString()));
      var videoJSon = JSON.parse(videoObj.toString());
      setIdVideo(videoJSon.id);
    }
  }, [videoInfo]);

  useEffect(() => {
    setVideo(videoInfor)
  }, [idVideo, videoInfor])

  useEffect(() => {
    if (video) {
      setLikes(video.like || 0);
      setIsLiked(video.isLike)
      console.log(video);
      console.log(likes, isLiked)
    }
  }, [video]);

  const fetchLikeStatus = async () => {
    const token = await AsyncStorage.getItem("access_token");
    
    if(!token) {
      return;
    }
      console.log(`${SERVER_URI}/api/Video/updateVideoLike/${video?.id}?isLike=${!isLiked}`)
      await axios
      .put(`${SERVER_URI}/api/Video/updateVideoLike/${video?.id}?isLike=${!isLiked}`,
        null, 
        {
          headers: {
            "Cookie": token?.toString(),
          },
        })
      .then((res) => {
        setIsLiked(!isLiked);
        console.log("Like success")
      })
      .catch((error) => {
        console.log("Error like video: " + error);
      });
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    fetchLikeStatus();
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
                isLiked ? styles.likeButtonActive : styles.likeButtonInactive,
              ]}
              onPress={handleLike}
            >
              <FontAwesome
                style={{marginRight: 10}}
                name={isLiked ? "thumbs-up" : "thumbs-o-up"}
                size={24}
                color={isLiked ? "#0866ff" : "#757575"}
              />
              <Text style={[styles.likeCount, isLiked && styles.likeTextActive]}>
                {likes}
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
    backgroundColor: "#F0F0F0",
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
