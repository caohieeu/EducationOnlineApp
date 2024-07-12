import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { commonStyles } from '@/styles/common'
import AnimatedLoader from 'react-native-animated-loader'

export default function Loader() {
  return (
    <LinearGradient
        colors={["#E5ECF9", "#F6F7F9"]}
        style={commonStyles.containerCenter}
    >
        <AnimatedLoader
            visible={true}  
            overlayColor="rgba(255,255,255,0,0.75)"
            source={require("@/assets/animation/animated2.json")}
            animationStyle={{width: 200, height: 200}}
            speed={1.5}
        />
    </LinearGradient>
  )
}
