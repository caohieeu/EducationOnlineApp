import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { isLoaded, useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useEffect, useState } from 'react';
import { View } from 'react-native'
import { Toast, ToastProvider } from 'react-native-toast-notifications';
import { QueryClient, QueryClientProvider } from 'react-query';
import useSignalRConnection from '@/hooks/useSignalRConnection';
import useUser from '@/hooks/useUser';
import { HubConnection } from '@microsoft/signalr';
import { LogBox } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const SignalRContext = createContext<HubConnection | null>(null);
export default function RootLayout() {
  LogBox.ignoreAllLogs(true);
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
  const { user } = useUser();
  const [isLogged, setIsLogged] = useState(false);
  // const contextValue = useSignalRConnection("edunimohub", {
  //   userId: user?.id,
  // });


  return <>{isLogged ? <View></View> : (
    <QueryClientProvider client={new QueryClient()}>
      {/* <SignalRContext.Provider value={contextValue}> */}
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(routes)/welcome-intro/index" />
          <Stack.Screen name="(routes)/auth/signin/index" />
          <Stack.Screen name="(routes)/auth/signup/index" />
          <Stack.Screen name="(routes)/auth/verifyAccount/index" />
          <Stack.Screen name="(routes)/profile-detail/index" />
          <Stack.Screen name="(routes)/follow/follower" />
          <Stack.Screen name="(routes)/follow/following" />
          <Stack.Screen name="(routes)/profile-other/index" />
          <Stack.Screen name="(routes)/profile-other/teacher-courses" />
          <Stack.Screen name="(routes)/upload/upload-video" />
          <Stack.Screen name="(routes)/upload/upload-course" />
          <Stack.Screen name="(routes)/upload/upload-video-course" />
          <Stack.Screen name="(routes)/video/index" />
          <Stack.Screen name="(routes)/video/all-video" />
          <Stack.Screen name="(routes)/video/video-current-user" />
          <Stack.Screen name="(routes)/course/course-detail" />
          <Stack.Screen name="(routes)/course/all-course" />
          <Stack.Screen name="(routes)/room/waiting-room" />
          <Stack.Screen name="(routes)/room/stream-room" />
        </Stack>
      </ToastProvider>
      {/* </SignalRContext.Provider> */}
    </QueryClientProvider>
  )}</>;
}