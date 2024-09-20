import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

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
import { router } from 'expo-router'
import axios from 'axios'
import { SERVER_URI } from '@/utils/uri'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Toast } from 'react-native-toast-notifications'
import deloyImage from '@/utils/PickImageUtil'
import { assert } from 'console'

export default function UploadCourse() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Raleway_600SemiBold,
    Nunito_600SemiBold
  })

  const [courseUpload, setCourseUpload] = useState<CourseUpload>({
    title: "",
    desc: "",
    courseDetail: "",
    courseImage: "",
    price: 0,
    tags: [],
    discount: 0
  })
  const [text, setText] = useState('');
  const [clickLoading, setClickLoading] = useState(false);
  const [thumbnailCourse, setThumbnailCourse] = useState<string>("");

  const handleTextChange = (inputText: string) => {
    setText(inputText);
    renderTags(inputText);
  };

  const renderTags = (inputText: string) => {
    const hashtagRegex = /\B#\w*[a-zA-Z]+\w*/g;
    const tags = text.match(hashtagRegex);

    if (tags) {
      const tagsWithoutHash = tags.map(tag => tag.substring(1));
      setCourseUpload(prevState => ({ ...prevState, tags: tagsWithoutHash }));
    } else {
      setCourseUpload(prevState => ({ ...prevState, tags: [] }));
    }
  };

  const onCreateCourse = async () => {
    setClickLoading(true);
    const token = await AsyncStorage.getItem("access_token");

    await axios.post(`${SERVER_URI}/api/Course`,
      {
        title: courseUpload.title,
        desc: courseUpload.desc,
        courseDetail: courseUpload.courseDetail,
        courseImage: courseUpload.courseImage,
        price: courseUpload.price,
        tags: courseUpload.tags,
        discount: courseUpload.discount
      },
      {
        headers: { Cookie: token?.toString() }
      },
    )
      .then((res) => {
        router.push({
          pathname: "(routes)/upload/upload-video-course",
          params: {courseId: res.data._id}
      })
        setClickLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setClickLoading(false);
      })
  }

  const deloyImage = async (uri: string) => {
    const uriDefault = "https://imexpert.au/wp-content/uploads/2023/08/image-not-found.png";

    const uriParts = uri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    const fileType = `image/${fileName.split('.').pop()}`;
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      name: fileName,
      type: fileType,
    });
    await axios.post("https://api.microlap.vn/upload/image", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then((res) => {
        setThumbnailCourse(res.data.data.image_url);
        setCourseUpload({...courseUpload, courseImage: res.data.data.image_url})
      })
      .catch((err) => {
        console.log(err);
        setThumbnailCourse(uriDefault);
      })
  }

  const onChangeThumbnailCourse = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      })

      if (!result.canceled && result.assets) {
        await deloyImage(result.assets[0].uri);
      }
    } catch (err) {
      Toast.show("Lỗi khi chọn ảnh!", {
        type: "error",
        duration: 1400
      })
    }
  }


  
  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 50 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginHorizontal: 20,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="left" size={26} />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Raleway_700Bold",
            fontSize: 25,
            paddingLeft: 15
          }}
        >
          Thêm nội dung mô tả
        </Text>
      </View>

      <ScrollView>
        <View style={{ marginHorizontal: 20 }}>
          <View style={{
            marginTop: 30,
          }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Raleway_700Bold",
              }}
            >Tiêu đề</Text>
            <View style={{
              borderWidth: 1,
              borderRadius: 10,
              marginTop: 5
            }}>
              <TextInput
                onChangeText={(text) =>
                  setCourseUpload({ ...courseUpload, title: text })
                }
                value={courseUpload.title}
                style={{
                  width: "100%",
                  padding: 10,
                  paddingLeft: 15,
                  fontFamily: "Raleway_700Bold",
                  borderColor: "#757575",
                  fontSize: 15,
                }}
                placeholder="Đặt tiêu đề cho khóa học của bạn..."
              />
            </View>
          </View>

          <View style={{
            marginTop: 30
          }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Raleway_700Bold",
              }}
            >Mô tả</Text>
            <View style={{
              borderWidth: 1,
              borderRadius: 10,
              marginTop: 5
            }}>
              <TextInput
                onChangeText={(text) =>
                  setCourseUpload({ ...courseUpload, desc: text })
                }
                value={courseUpload.desc}
                style={{
                  fontFamily: "Raleway_700Bold",
                  fontSize: 15,
                  width: "100%",
                  padding: 10,
                  height: 100,
                  borderColor: "#757575",
                  paddingLeft: 15,
                  justifyContent: "flex-start",
                  textAlignVertical: 'top',
                }}
                multiline
                placeholder="Mô tả sơ lược về khóa học của bạn..."
              />
            </View>
          </View>

          <View style={{
            marginTop: 30
          }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Raleway_700Bold",
              }}
            >Chi tiết khóa học</Text>
            <View style={{
              borderWidth: 1,
              borderRadius: 10,
              marginTop: 5
            }}>
              <TextInput
                onChangeText={(text) =>
                  setCourseUpload({ ...courseUpload, courseDetail: text })
                }
                value={courseUpload.courseDetail}
                style={{
                  fontFamily: "Raleway_700Bold",
                  fontSize: 15,
                  width: "100%",
                  padding: 10,
                  height: 100,
                  paddingLeft: 15,
                  justifyContent: "flex-start",
                  borderColor: "#757575",
                  textAlignVertical: 'top',
                }}
                multiline
                placeholder="Mô tả chi tiết về khóa học của bạn..."
              />
            </View>
          </View>

          <View style={{
            marginTop: 30
          }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Raleway_700Bold",
              }}
            >Thumbnail</Text>
            <View style={{
              borderRadius: 10,
              marginTop: 5
            }}>
              <TouchableOpacity
                onPress={onChangeThumbnailCourse}
                style={{
                  width: "100%",
                  height: 200,
                  justifyContent: "center",
                  alignItems: "center",
                  borderStyle: "dashed",
                  borderWidth: 1,
                  borderColor: "#757575",
                  borderRadius: 10,
                  zIndex: 100
                }}
              >
                {thumbnailCourse != "" ? (
                  <Image
                    source={{ uri: thumbnailCourse || 
                      "https://static-00.iconduck.com/assets.00/image-not-found-01-icon-2048x2048-95wsi7vg.png" }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 10,
                      borderWidth: 0,
                    }}
                  />
                ) : (
                  <AntDesign
                    name='camera'
                    size={40}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{
            marginTop: 30
          }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Raleway_700Bold",
              }}
            >Giá (VNĐ)</Text>
            <View style={{
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "#757575",
              marginTop: 5
            }}>
              <TextInput
                onChangeText={(value) =>
                  setCourseUpload({ ...courseUpload, price: Number.parseFloat(value) })
                }
                value={courseUpload.price}
                keyboardType="numeric"
                style={{
                  width: "100%",
                  padding: 10,
                  paddingLeft: 15,
                }}
                multiline
                placeholder="100.000 VNĐ"
              />
            </View>
          </View>

          <View style={{
            marginTop: 30
          }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Raleway_700Bold",
              }}
            >Giảm giá</Text>
            <View style={{
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "#757575",
              marginTop: 5
            }}>
              <TextInput
                onChangeText={(value) => {
                  if (courseUpload.discount.toString().length <= 2) {
                    setCourseUpload({ ...courseUpload, discount: Number.parseFloat(value) })
                  }
                }
                }
                value={courseUpload.discount}
                keyboardType="numeric"
                style={{
                  width: "100%",
                  padding: 10,
                  paddingLeft: 15,
                }}
                multiline
                placeholder="0%"
              />
            </View>
          </View>

          <View style={{
            marginTop: 25
          }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Raleway_700Bold",
                marginBottom: 10
              }}
            >Tags</Text>
            <View style={{
              borderWidth: 1,
              borderColor: "#757575",
              padding: 10,
              borderRadius: 10,
              marginBottom: 20
            }}>
              <TextInput
                style={{
                  width: "100%",
                  fontSize: 18,
                  fontFamily: "Nunito_600SemiBold",
                }}
                placeholder="Thêm tag..."
                onChangeText={handleTextChange}
                value={text}
                multiline={true}
              />
            </View>
          </View>
          <View style={styles.tagsContainer}>
            {courseUpload.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={{ color: "white" }}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={{ marginBottom: 40, marginTop: 20 }}>
            <TouchableOpacity
              onPress={onCreateCourse}
              style={{
                backgroundColor: "#2865e3",
                padding: 15,
                borderRadius: 10,
              }}
            >
              {!clickLoading ? (
                <Text style={{
                  color: "white",
                  fontSize: 16,
                  fontFamily: "Raleway_700Bold",
                  textAlign: "center"
                }}>
                  Tạo khóa học
                </Text>
              ) : (
                <ActivityIndicator size={"small"} color={"white"} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
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