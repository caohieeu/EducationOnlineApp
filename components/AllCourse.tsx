import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import { useCourses } from '@/hooks/useCourses';
import CourseCard from './CourseCard';
import { commonStyles } from '@/styles/common';
import { useQueryRequest } from '@/utils/useQueryRequest';
import { router } from 'expo-router';

export default function AllCourse() {
  const flatlistref = useRef(null);
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Raleway_600SemiBold,
    Nunito_600SemiBold
})

  const { queryString, updateQueryState } = useQueryRequest({
    pageSize: 5,
    page: 1,
  });

  const { data: courses, refetch, isLoading } = useCourses(queryString);

  return (
    <>
      <View style={{ flex: 1, marginHorizontal: 5, marginTop: 30 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Text style={{fontSize: 20, fontFamily: "Raleway_700Bold"}}>Khóa học nổi bật</Text>
          <TouchableOpacity
            onPress={() => router.push({
              pathname: "(routes)/course/all-course",
          })}
          >
            <Text
              style={{fontSize: 15, color: "#2467EC", fontFamily: "Nunito_600SemiBold"}}
            >
              Xem tất cả
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList 
          ref={flatlistref}
          data={courses?.data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => <CourseCard item={item} />}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({})