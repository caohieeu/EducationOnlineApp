import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native'
import React from 'react'
import useFollower from '@/hooks/useFollower'
import Loader from '@/loader/loader';
import { LinearGradient } from 'expo-linear-gradient';
import useUser from '@/hooks/useUser';
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
import { commonStyles } from '@/styles/common';
import ProfileScreen from '../tabs/profile/profile.screen';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import useCurrentUser from '@/hooks/useCurrentUser';

export default function FollowerScreen() {
  const { id } = useLocalSearchParams();

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Raleway_600SemiBold,
    Nunito_600SemiBold
  })

  const { loading, follower } = useFollower(id);
  const { currentUser } = useCurrentUser(id);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={{ flex: 1, paddingTop: 60 }}
        >
          <ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{
                fontFamily: "Raleway_700Bold",
                fontSize: 20,
              }}>
                {currentUser?.dislayName}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
              <Text style={{
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Nunito_600SemiBold",
                fontSize: 20,
              }}>
                Người theo dõi
              </Text>
            </View>

            <View style={{
              marginTop: 30,
              marginHorizontal: 30
            }}>
              {follower?.length == 0 ? (
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                  <View style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    marginTop: 20
                  }}>
                    <Image
                      style={{
                        width: 250,
                        height: 250,
                        marginTop: 50
                      }}
                      source={require("@/assets/images/not_found.png")}
                    />
                    <Text style={{
                      justifyContent: "center",
                      fontSize: 23,
                      opacity: 0.6
                    }}>
                      Không ai theo dõi
                    </Text>
                  </View>
                </View>
              ) : (
                <FlatList
                  data={follower}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "(routes)/profile-other",
                          params: { userId: item.follower.user_id.toString() }
                        })
                      }
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingTop: 5,
                      }}>
                      <Image
                        style={{ width: 60, height: 60, borderRadius: 100 }}
                        source={{
                          uri: currentUser?.avatarUrl ||
                            "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                        }}
                      />
                      <Text style={[commonStyles.item, {
                        marginLeft: 10,
                        fontSize: 18,
                        fontFamily: "Nunito_600SemiBold"
                      }]}>{item.follower.user_display_name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      )}
    </>
  )
}

const styles = StyleSheet.create({})