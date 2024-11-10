import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import HeaderScreen from '@/components/HeaderScreen'
import { SERVER_URI } from '@/utils/uri'
import axios from 'axios'
import { useLocalSearchParams } from 'expo-router'
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
import { Ionicons } from '@expo/vector-icons'
import VideoCourseCard from '@/components/VideoCourseCard'
import CommentSection from '@/components/CommentSection'

export default function CourseDetailScreen() {

  const flatlistref = useRef(null);
  const { courseId } = useLocalSearchParams();

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Raleway_600SemiBold,
    Nunito_600SemiBold
  })

  const [course, setCourse] = useState<Course>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeButton, setActiveButton] = useState("Detail")

  useEffect(() => {
    const subscription = async () => {
      if (courseId != "") {
        await axios
          .get(`${SERVER_URI}/api/Course/GetCourse/${courseId}`)
          .then((res: any) => {
            setCourse(res.data);
            setLoading(false);
          })
          .catch((error: any) => {
            setError(error.message);
            setLoading(false);
            console.log("Error fetch video: " + error);
          })
      }
    }
    subscription();
  }, [courseId])

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1 }}
    >
      <HeaderScreen titleHeader="Chi tiết khóa học" />
      <ScrollView nestedScrollEnabled={true}>
        <View style={{
          marginHorizontal: 13,
          marginBottom: 10
        }}>
          <Image
            source={{ uri: course?.courseImage || "https://static-00.iconduck.com/assets.00/image-not-found-01-icon-2048x2048-95wsi7vg.png" }}
            style={{
              width: "100%",
              height: 230
            }}
          />
          <View style={{
            marginTop: 20
          }}>
            <Text
              style={{
                fontFamily: "Raleway_700Bold",
                fontSize: 20
              }}
            >
              {course?.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10
              }}
            >
              <Text
                style={styles.textRegular}
              >
                {course?.price + "  vnđ"}
              </Text>

              <Text style={styles.textRegular}>
                {10 + " Học sinh"}
              </Text>
            </View>

            <View style={{
              marginTop: 20
            }}>
              <Text style={{
                fontFamily: "Nunito_700Bold",
                fontSize: 20,
              }}>
                Mô tả khóa học
              </Text>
              <View style={{
                flexDirection: "row",
                alignItems: "center"
              }}>
                <Ionicons name="checkmark-done-outline" size={18} />
                <Text style={{
                  marginTop: 5,
                  fontFamily: "Raleway_600SemiBold",
                  fontSize: 16,
                  marginLeft: 5
                }}>
                  {"" + course?.desc}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 25,
              marginHorizontal: 16,
              backgroundColor: "#E1E9F8",
              borderRadius: 50,
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 42,
                backgroundColor:
                  activeButton === "Detail" ? "#2467EC" : "transparent",
                borderRadius: activeButton === "Detail" ? 50 : 0,
              }}
              onPress={() => setActiveButton("Detail")}
            >
              <Text
                style={{
                  color: activeButton === "Detail" ? "#fff" : "#000",
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                Chi tiết
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 42,
                backgroundColor:
                  activeButton === "Video" ? "#2467EC" : "transparent",
                borderRadius: activeButton === "Video" ? 50 : 0,
              }}
              onPress={() => setActiveButton("Video")}
            >
              <Text
                style={{
                  color: activeButton === "Video" ? "#fff" : "#000",
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 42,
                backgroundColor:
                  activeButton === "Comments" ? "#2467EC" : "transparent",
                borderRadius: activeButton === "Comments" ? 50 : 0,
              }}
              onPress={() => setActiveButton("Comments")}
            >
              <Text
                style={{
                  color: activeButton === "Comments" ? "#fff" : "#000",
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                Bình luận
              </Text>
            </TouchableOpacity>
          </View>
          {activeButton == "Detail" && (
            <View style={{
              marginLeft: 5,
              marginTop: 7
            }}>
              <Text style={{
                fontFamily: "Nunito_700Bold",
                fontSize: 20,
              }}>
                Chi tiết khóa học
              </Text>
              <Text style={{
                marginTop: 5,
                fontFamily: "Nunito_600SemiBold",
                fontSize: 16,
                opacity: 0.7
              }}>
                {course?.courseDetail}
              </Text>

              <View style={[styles.tagsContainer, {marginTop: 10}]}>
                {course?.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={{ color: "white" }}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {activeButton == "Video" && (
              <FlatList 
                ref={flatlistref}
                data={course?.videos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <VideoCourseCard item={item} />}
              />
          )}
          {activeButton == "Comments" && (
            <CommentSection moduleId={course?._id || 'defaultModuleId'} />
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  textRegular: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#757575',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 5,
    marginBottom: 5,
  },
})