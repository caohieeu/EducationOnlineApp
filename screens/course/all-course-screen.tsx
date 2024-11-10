import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import { LinearGradient } from 'expo-linear-gradient';
  import HeaderScreen from '@/components/HeaderScreen';
  import CourseCard from '@/components/CourseCard';
  import { useCourses } from '@/hooks/useCourses';
import { useQueryRequest } from '@/utils/useQueryRequest';
  
  export default function AllCoursesScreen() {
    const [activeCategory, setActiveCategory] = useState('All');
    const { queryString, updateQueryState } = useQueryRequest({
        pageSize: 5,
        page: 1,
      });
    
      const { data: courses, refetch, isLoading, error } = useCourses(queryString);
  
    return (
      <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
        <HeaderScreen titleHeader="All Courses" />
        <View style={styles.categoryFilterContainer}>
          {['All', 'Popular', 'New', 'Trending'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.activeCategoryButton,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  activeCategory === category && styles.activeCategoryButtonText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2467EC" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error.message}</Text>
        ) : (
          <FlatList
            data={courses?.data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CourseCard item={item} />}
            contentContainerStyle={styles.courseList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </LinearGradient>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    categoryFilterContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 10,
    },
    categoryButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginHorizontal: 5,
      backgroundColor: '#E1E9F8',
      borderRadius: 20,
    },
    activeCategoryButton: {
      backgroundColor: '#2467EC',
    },
    categoryButtonText: {
      fontFamily: 'Nunito_600SemiBold',
      color: '#000',
    },
    activeCategoryButtonText: {
      color: '#fff',
    },
    loader: {
      marginTop: 50,
    },
    errorText: {
      textAlign: 'center',
      color: 'red',
      fontFamily: 'Nunito_600SemiBold',
    },
    courseList: {
      paddingHorizontal: 16,
    },
  });
  