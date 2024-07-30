import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

export default function VideoUpload() {
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
    <View style={{ flex: 1, marginHorizontal: 16, marginTop: 30 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Text style={{fontSize: 20, fontFamily: "Raleway_700Bold"}}>Video nổi bật</Text>
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
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => <CourseCard item={item} />}
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