import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Header from '@/components/Header'
import { commonStyles } from '@/styles/common'
import SearchInput from '@/components/SearchInput'
import HomeBarSlider from '@/components/HomeBarSlider'
import AllVideo from '@/components/AllVideo'
import useUser from '@/hooks/useUser'
import Loader from '@/loader/loader'
import VideoUpload from '@/components/VideoUpload'
import AllCourse from '@/components/AllCourse'

export default function HomeScreen() {
    const { user, loading } = useUser();

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <LinearGradient
                    colors={["#E5ECF9", "#F6F7F9"]}
                    style={{ flex: 1, paddingTop: 50 }}
                >
                    <Header />
                    <ScrollView>
                        <SearchInput />
                        <HomeBarSlider />
                        <AllCourse />
                        <VideoUpload />
                    </ScrollView>
                </LinearGradient>
            )}
        </>
    )
}
