import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { isLoaded, useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native'
import OnBoarding from "./(routes)/onboarding/index";
import { ToastProvider } from 'react-native-toast-notifications';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const [isLogged, setIsLogged] = useState(false);

  return <>{isLogged ? <View></View> : (
    <ToastProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(routes)/welcome-intro" />
        <Stack.Screen name="(routes)/auth/signin" />
        <Stack.Screen name="(routes)/auth/signup" />
        <Stack.Screen name="(routes)/auth/verifyAccount" />
        <Stack.Screen name="(routes)/profile-detail" />
        <Stack.Screen name="(routes)/follow/follower" />
        <Stack.Screen name="(routes)/follow/following" />
        <Stack.Screen name="(routes)/profile-other" />
        <Stack.Screen name="(routes)/upload/upload-video" />
        <Stack.Screen name="(routes)/upload/upload-course" />
        <Stack.Screen name="(routes)/upload/upload-video-course" />
      </Stack>
    </ToastProvider>
  )}</>;
}
