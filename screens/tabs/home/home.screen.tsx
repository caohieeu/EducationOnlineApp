import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Toast } from 'react-native-toast-notifications'
import useUser from '@/hooks/useUser'
import { router } from 'expo-router'
import { commonStyles } from '@/styles/common'

export default function HomeScreen() {
    //const { user } = useUser();

    useEffect(() => {
    }, [])

    return (
    <View style={[commonStyles.containerCenter]}>
        <Text>Welcome!</Text>
        <Text>{"Hello"}</Text>
    </View>
    )
}
