import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import HeaderScreen from '@/components/HeaderScreen'
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
import Loader from '@/loader/loader'
import useUser from '@/hooks/useUser'
import useCoursesTeacher from '@/hooks/useCoursesTeacher'
import MyCoursesCard from '@/components/MyCoursesCard'
import { useGetCourseStudent } from '@/hooks/useGetCourseStudent'
import { useQueryRequest } from '@/utils/useQueryRequest'

export default function StudentCoursesScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Raleway_600SemiBold,
    Nunito_600SemiBold
  })

  const [course, setCourse] = useState<Course>();
  const [error, setError] = useState("");
  const [activeButton, setActiveButton] = useState("Detail")
  const flatlistref = useRef(null);
  const { user } = useUser();
  //const { courses, loading } = useCoursesTeacher(1, user?.id);

  const { queryString, updateQueryState } = useQueryRequest({
    pageSize: 20,
    page: 1,
  });
  const { data: courses, refetch, isLoading } = useGetCourseStudent(queryString);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={{ flex: 1 }}
        >
          <View style={{
            marginTop: 50
          }}>
            <Text style={{
              fontFamily: "Nunito_700Bold",
              fontSize: 25,
              fontWeight: "bold",
              textAlign: "center",
            }}>
              Các khóa học đã mua
            </Text> 
          </View>
          <FlatList
            ref={flatlistref}
            data={courses?.data}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <MyCoursesCard item={item} />}
          />
        </LinearGradient>
      )}
    </>
  )
}

const styles = StyleSheet.create({})