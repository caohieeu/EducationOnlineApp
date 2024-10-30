import { 
    ActivityIndicator, 
    FlatList, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View
  } from 'react-native'
  import React, { useRef } from 'react'
  
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
  import VideoCard from './VideoCard';
  import { commonStyles } from '@/styles/common';
  import { useQueryRequest } from '@/utils/useQueryRequest';
  import { useGetListVideo } from '@/hooks/useGetListVideo';
import { useGetRecommendVideos } from '@/hooks/useGetRecommendVideos';
  
  export default function RecomendVideo({type} : {type:string}) {
    const flatlistref = useRef(null);
    let [fontsLoaded, fontError] = useFonts({
      Raleway_700Bold,
      Nunito_400Regular,
      Nunito_700Bold,
      Raleway_600SemiBold,
      Nunito_600SemiBold
  })
  
    const { queryString, updateQueryState } = useQueryRequest({
      pageSize: 20,
      page: 1,
    });
    
    const { data: videos, refetch, isLoading } = useGetRecommendVideos(queryString);
    return (
      <>
        {isLoading ? (
          <ActivityIndicator
            style={commonStyles.containerCenter}
            size={"large"}
          />
        ) : (
          <View style={{ flex: 1, marginHorizontal: 0, marginTop: 30 }}>
          {type === 'horizontal' ? (
            <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{fontSize: 20, fontFamily: "Raleway_700Bold"}}>Video đề xuất</Text>
            <TouchableOpacity>
              <Text
                style={{fontSize: 15, color: "#2467EC", fontFamily: "Nunito_600SemiBold"}}
              >
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
          ) : null}
          <FlatList 
            ref={flatlistref}
            data={videos?.data}
            horizontal={type === "horizontal" ? true : false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => <VideoCard item={item} />}
          />
        </View>
        )}
      </>
    )
  }
  
  const styles = StyleSheet.create({})