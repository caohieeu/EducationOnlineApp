import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyVideoPlayer from '@/components/MyVideoPlayer'
import { useLocalSearchParams } from 'expo-router';
import HeaderScreen from '@/components/HeaderScreen';
import { LinearGradient } from 'expo-linear-gradient';

import {
  useFonts,
} from '@expo-google-fonts/raleway'
import {
  Nunito_400Regular,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito"

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
  
  if(!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderScreen titleHeader='Xem video' />
      {videoInfo != "" && videoInfo != null ? (
        <MyVideoPlayer videoInfo={JSON.stringify(videoInfo)} />
      ) : (
        <Text>Video not found</Text>
      )}

      <ScrollView>
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={{ flex: 1, paddingTop: 50 }}
        >
          <View style={{
            paddingHorizontal: 15
          }}>
            <Text style={{
              fontSize: 24,
              fontFamily: "Nunito_700Bold",
              fontWeight: "bold"
            }}>
              {video?.title}
            </Text>
            <Text
              style={{
                fontFamily: "Nunito_400Regular",
                color: "#757575",
                marginTop: 15
              }}
            >
              {video?.description}
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({})