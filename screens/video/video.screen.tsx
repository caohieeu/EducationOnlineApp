import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyVideoPlayer from '@/components/MyVideoPlayer'
import { useLocalSearchParams } from 'expo-router';
import HeaderScreen from '@/components/HeaderScreen';
import CommentSection from '@/components/CommentSection';
import { LinearGradient } from 'expo-linear-gradient';

import {
  useFonts,
} from '@expo-google-fonts/raleway'
import {
  Nunito_400Regular,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito"
import RecomendVideo from '@/components/RecomendVideo';

export default function VideoScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  })

  const { videoInfo } = useLocalSearchParams();
  const [video, setVideo] = useState<VideoSingle>();

  useEffect(() => {
    var videoObj = JSON.parse(JSON.stringify(videoInfo));
    videoObj = JSON.parse(videoObj.toString());
    setVideo(videoObj);
  }, [])

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

  if(!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={{ flex: 1}}
        >
      <HeaderScreen titleHeader='Xem video' />
      {videoInfo != "" && videoInfo != null ? (
        <MyVideoPlayer videoInfo={JSON.stringify(videoInfo)} />
      ) : (
        <Text>Video not found</Text>
      )}

      <ScrollView>
        
          <View style={{
            paddingHorizontal: 18
          }}>
            <Text style={{
              fontSize: 24,
              fontFamily: "Nunito_700Bold",
              fontWeight: "bold"
            }}>
              {video?.title}
            </Text>
            
            {/* Hiển thị lượt xem và ngày đăng */}
            <Text style={{
              fontFamily: "Nunito_400Regular",
              color: "#757575",
              marginTop: 10
            }}>
              {`${video?.view || 0} lượt xem • ${formatUploadDate(video?.time instanceof Date ? video.time.toISOString() : video?.time || '')}`}
            </Text>

            {/* Mô tả video */}
            <Text
              style={{
                fontFamily: "Nunito_400Regular",
                color: "#757575",
                marginTop: 15
              }}
            >
              {video?.description}
            </Text>

            <RecomendVideo type='vertical' />
            
            <CommentSection moduleId={video?.id || 'defaultModuleId'} />
          </View>
      </ScrollView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({})
