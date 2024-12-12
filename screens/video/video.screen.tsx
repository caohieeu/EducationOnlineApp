import { ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import MyVideoPlayer from '@/components/MyVideoPlayer';
import { router, useLocalSearchParams } from 'expo-router';
import HeaderScreen from '@/components/HeaderScreen';
import CommentSection from '@/components/CommentSection';
import { LinearGradient } from 'expo-linear-gradient';

import { useFonts } from '@expo-google-fonts/raleway';
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import RecomendVideo from '@/components/RecomendVideo';
import useGetVideoDetail from '@/hooks/useGetVideoDetail';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { VideoDecoderProperties } from 'react-native-video';
import { Toast } from 'react-native-toast-notifications';

export default function VideoScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  const { videoInfo, typeVideo } = useLocalSearchParams();
  const [idVideo, setIdVideo] = useState("");
  const [video, setVideo] = useState<VideoSingle | null>(null);
  // const { loading, error, videoInfor } = useGetVideoDetail(idVideo || "");
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false); 
  const [isFollow, setIsFollow] = useState(false); 
  const [likes, setLikes] = useState(video?.like || 0);

  useEffect(() => {
    if (videoInfo) {
      if(typeVideo == "video") {
        try {
          const videoObj = JSON.parse(videoInfo.toString());
          if (videoObj && videoObj.id) {
            console.log(typeVideo)
            fetchVideoDetail(videoObj.id);
          }
        } catch (err) {
          console.error("Error parsing videoInfo:", err);
        }
      }
      else {
        const videoObj = JSON.parse(JSON.stringify(videoInfo));
        setVideo(JSON.parse(videoObj.toString()));
      }
    }
  }, [videoInfo]);

  useEffect(() => {
    // fetchVideoDetail();
  }, [idVideo])

  useEffect(() => {
    if (video) {
      setLikes(video.like || 0);
      setIsLiked(video.isLike)
      setIsFollow(video.isSub)
    }
  }, [video]);

  const fetchVideoDetail = async (videoId:string) => {
    if (!videoId) {
      Toast.show('ID không hợp lệ', { type: 'error', duration: 1400 });
      return;
    }

      const token = await AsyncStorage.getItem("access_token");
      
      axios
      .get(`${SERVER_URI}/api/Video/getVideo/${videoId}`, {
        headers: {
          "Cookie": token?.toString(),
        },
      })
      .then((response) => {
        setVideo(response.data);
      })
      .catch((err: any) => {
        Toast.show(err.message || 'Error fetching video details', { type: 'error', duration: 1400 });
      });
  };

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

  const onFollow = async () => {
    try {
        const token = await AsyncStorage.getItem("access_token");
        await axios.post(`${SERVER_URI}/api/Follow/PostFollow`, {
            userId: video?.user.user_id
        }, {
            headers: {
                "Cookie": token?.toString()
              }
        });

        Toast.show('Follow succeeded', {
            type: 'success',
            duration: 1400,
        });
        setIsFollow(true);
        // refreshFollowing();
    } catch (error) {
        console.error('Error when posting follow:', error);
        Toast.show('Error while following', {
            type: 'danger',
            duration: 1400,
        });
    }
};

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
            {typeVideo == "video" && (
              <Text style={styles.subInfo}>
              {`${video?.view || 0} lượt xem • ${formatUploadDate(
                video?.time instanceof Date ? video.time.toISOString() : video?.time || ''
              )}`}
            </Text>
            )}

            {/* Nút Like */}
            {typeVideo == "video" && (
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
            )}

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

          <View style={styles.uploaderContainer}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "(routes)/profile-other",
                  params: { userId: video?.user.user_id }
                })
              }
            >
              <Image 
                source={{ uri: video?.user.user_avatar || "https://via.placeholder.com/50" }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>

            <View style={styles.uploaderInfo}>
              <Text style={styles.uploaderName}>{video?.user.user_name || "Unknown"}</Text>
            </View>
            <TouchableOpacity
              style={[styles.followButton, video?.isSub && styles.followingButton]}
              onPress={onFollow}
            >
              <Text style={styles.followButtonText}>
                {isFollow ? "Đã theo dõi" : "Theo dõi"}
              </Text>
            </TouchableOpacity>
          </View>

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
    backgroundColor: "#F0F0F0",
  },
  likeText: {
    fontSize: 18,
    marginRight: 8,
    fontFamily: "Nunito_400Regular",
  },
  likeTextActive: {
    color: "#FF4500",
  },
  likeCount: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
  uploaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
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
  uploaderInfo: {
    flexDirection: "column",
  },
  uploaderName: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#333",
  },
  followerCount: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#757575",
  },
  followButton: {
    backgroundColor: "#0866ff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: "#E0E0E0",
  },
  followButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    marginRight: -40
  },
});
