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
import useCourses from '@/hooks/useCourses';
import CourseCard from './CourseCard';
import { commonStyles } from '@/styles/common';

export default function AllCourse() {
  const flatlistref = useRef(null);
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Raleway_600SemiBold,
    Nunito_600SemiBold
})

  const { videoCourses, loading, error } = useCourses(1);

  return (
    <>
      {loading ? (
        <ActivityIndicator
          style={commonStyles.containerCenter}
          size={"large"}
        />
      ) : (
        <View style={{ flex: 1, marginHorizontal: 16, marginTop: 30 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Text style={{fontSize: 20, fontFamily: "Raleway_700Bold"}}>Khóa học nổi bật</Text>
          <TouchableOpacity>
            <Text
              style={{fontSize: 15, color: "#2467EC", fontFamily: "Nunito_600SemiBold"}}
            >
              Xem tất cả
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList 
          ref={flatlistref}
          data={videoCourses}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => <CourseCard item={item} />}
        />
      </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({})