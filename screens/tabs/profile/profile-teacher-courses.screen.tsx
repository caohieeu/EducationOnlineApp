import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Header from '@/components/Header'
import HeaderScreen from '@/components/HeaderScreen'
import useCoursesTeacher from '@/hooks/useCoursesTeacher'
import useUser from '@/hooks/useUser'
import MyCoursesCard from '@/components/MyCoursesCard'
import Loader from '@/loader/loader'

export default function ProfileTeacherCoursesScreen() {
    const flatlistref = useRef(null);
    const { user } = useUser();
    const { courses, loading } = useCoursesTeacher(1, user?.id);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <LinearGradient
                    colors={["#E5ECF9", "#F6F7F9"]}
                    style={{ flex: 1 }}
                >
                    <HeaderScreen titleHeader='Các khóa học' />
                    <FlatList
                        ref={flatlistref}
                        data={courses}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item }) => <MyCoursesCard item={item} />}
                    />
                </LinearGradient>
            )}
        </>
    )
}

const styles = StyleSheet.create({})