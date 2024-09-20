import { FlatList, InteractionManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'

import { 
  useFonts, 
  Raleway_700Bold, 
  Raleway_600SemiBold 
} from '@expo-google-fonts/raleway'
import { 
  Nunito_400Regular,
  Nunito_700Bold, 
  Nunito_600SemiBold 
} from "@expo-google-fonts/nunito"
import useCourses from '@/hooks/useCourses';
import CourseCard from './CourseCard';
import VideoCard from './VideoCard';
import { useQueryRequest } from '@/utils/useQueryRequest';
import { useGetListVideo } from '@/hooks/useGetListVideo';
import SearchInput from './SearchInput';
import HomeBarSlider from './HomeBarSlider';
import AllCourse from './AllCourse';

export default function VideoUpload() {
  const flatlistref = useRef(null);
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Raleway_600SemiBold,
    Nunito_600SemiBold
})
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [data, setData] = useState([]);
  const nextPageIdentifierRef = useRef();
  const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);
  const { queryString, updateQueryState } = useQueryRequest({
    pageSize: 10,
    page: 1,
  });
  const { data: videos, refetch, isLoading } = useGetListVideo(queryString);

  const fetchNextData = () => {

  };

  return (
    <View style={{ flex: 1, marginHorizontal: 16, marginTop: 30 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Text style={{fontSize: 20, fontFamily: "Raleway_700Bold", paddingLeft: 5}}>
          Video nổi bật
        </Text>
        <TouchableOpacity>
          <Text
            style={{fontSize: 15, color: "#2467EC", fontFamily: "Nunito_600SemiBold"}}
          >
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
      data={videos?.data}
      renderItem={({ item }) => <VideoCard item={item} />}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={() => {
        InteractionManager.runAfterInteractions(() => {
          console.log("Reached End");
        });
      }}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false} 
    />
    </View>
  )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
        maxHeight: '50%',
        alignItems: "flex-start",
    },
})