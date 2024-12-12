import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Button,
  Image,
  TouchableWithoutFeedback,
  Animated,
  LayoutAnimation,
  Modal,
} from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import { SERVER_URI } from '@/utils/uri'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import { Toast } from 'react-native-toast-notifications'
import { Video, ResizeMode } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { commonStyles } from '@/styles/common'
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

export default function UploadVideoCourse() {
  const { courseId } = useLocalSearchParams();
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Raleway_600SemiBold,
    Nunito_600SemiBold
  })

  type VideoType = {
    uri: string;
    filename: string;
    video_size: number;
    fileType: string;
  }
  const [text, setText] = useState<string[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCheckPublic, setIsCheckPublic] = useState(false);
  const [isCheckPrivate, setIsCheckPrivate] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [thumbnailVideo, setThubnailVideo] = useState<string[]>([]);
  const [videoUpload, setVideoUpload] = useState<VideoUploadCourse[]>([])
  const [modalVisibleDesc, setModalVisibleDesc] = useState(false)
  const [loadingUploadVideo, setLoadingUploadVideo] = useState(false)
  const [opened, setOpened] = useState<{ [key: string]: boolean }>({
    video1: false,
    video2: false,
    video3: false,
    video4: false,
    video5: false
  });
  //const [animation] = useState(new Animated.Value(0));
  const defaultImage = "https://imexpert.au/wp-content/uploads/2023/08/image-not-found.png";

  const handlePublicPress = (pos: number) => {
    setIsCheckPublic(!isCheckPublic);
    setIsCheckPrivate(false);
    updateVideoCourse('status', 0, pos)
  }

  const handlePrivatePress = (pos: number) => {
    setIsCheckPrivate(!isCheckPrivate);
    setIsCheckPublic(false);
    updateVideoCourse('status', 1, pos)
  }

  const initVideoUpload = (image: string, video_size: number, file_type: string) => {
    const newVideos = {
      title: "",
      description: "",
      image_url: image,
      video_size,
      file_type,
      status: 0,
      tags: [],
    }

    setVideoUpload((prevState) => [...prevState, newVideos]);
  };

  const handleTextChange = (inputText: string, pos: number) => {
    setText((prevState) =>
      prevState.map((item: any, index) => {
        if (index === pos) {
          return inputText;
        }
        return item;
      })
    );
    console.log(text);
    renderTags(inputText, pos);
  };

  const renderTags = (inputText: string, pos: number) => {
    const hashtagRegex = /\B#\w*[a-zA-Z]+\w*/g;
    const tags = inputText.match(hashtagRegex);

    if (tags) {
      const tagsWithoutHash = tags.map(tag => tag.substring(1));
      updateVideoCourse('tags', tagsWithoutHash, pos)
    } else {
      updateVideoCourse('tags', [], pos)
    }
  };

  const simulateUpload = (videoPath: string, index: number, total: number) => {
    return new Promise<void>(resolve => {
      let uploadTime = 2000;
      let progressIncrement = 1 / total;

      setTimeout(() => {
        setProgress((prevProgress) => prevProgress + progressIncrement);
        resolve();
      }, uploadTime);
    });
  };

  const uploadVideos = async (videos: VideoType[]) => {
    setIsLoading(true);
    setProgress(0);
    for (let i = 0; i < videos.length; i++) {
      await simulateUpload(videos[i].uri, i, videos.length);

      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videos[i].uri, {
          time: 1000
        })
        if (uri != null) {
          try {
            const uriParts = uri.split('/');
            const fileName = uriParts[uriParts.length - 1];
            const fileType1 = `image/${fileName.split('.').pop()}`;
            const formData = new FormData();
            formData.append('file', {
              uri: uri,
              name: fileName,
              type: fileType1,
            });
            await axios.post("https://upload.hightfive.click/upload/", formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            })
              .then((res) => {
                initVideoUpload(res.data.url, videos[i].video_size, videos[i].fileType);
              })
              .catch((err) => {
                initVideoUpload(defaultImage, videos[i].video_size, videos[i].fileType);
              })
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        console.log(err);
      }

    }
    setIsLoading(false);
  };

  const uploadToAws = async (preSignedUrl: string, videoId: string, index: number) => {
    try {
      if (videos.length > 0) {
        const base64 = await FileSystem.readAsStringAsync(videos[index].uri, {
          encoding: FileSystem.EncodingType.Base64
        });
        const buffer = Buffer.from(base64, "base64");
        await axios.put(preSignedUrl, buffer, {
          headers: {
            'Content-Type': 'video/mp4',
          }
        })
        console.log(`Đã tải lên được video thứ ${index + 1}...`)
        await simulateUpload(videos[index].uri, index, videos.length);
      }
    } catch (err) {
      console.log("Error when upload to aws: " + err);
      await axios.delete(`${SERVER_URI}/api/Course/RemoveVideoFromCourse/${courseId}?videoId=${videoId}?isUploaded=false`);
    }
  }

  const saveVideoCourse = async (preSignedUrl: string, videoId: string, index: number) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token != "") {
      try {
        await axios
          .put(`${SERVER_URI}/api/Course/PutCourseVideo/${courseId}`,
            {
              _id: videoId,
              title: videoUpload[index].title,
              description: videoUpload[index].description,
              image_url: "",
              video_size: videoUpload[index].video_size,
              file_type: videoUpload[index].file_type,
              status: videoUpload[index].status,
              tags: videoUpload[index].tags
            },
            {
              headers: { Cookie: token?.toString() }
            },
          )
        await uploadToAws(preSignedUrl, videoId, index);
      } catch (err) {
        console.log("Error when save video course: " + err)
      }
    }
  }

  const postUploadVideos = async () => {
    setProgress(0);
    setLoadingUploadVideo(true);
    var n = videos.length;

    const token = await AsyncStorage.getItem("access_token");
    if (token != "") {
      try {
        const response = await axios
          .get(`${SERVER_URI}/api/Course/GetCoursePresignedUrl?n=${n}`, {
            headers: { Cookie: token?.toString() }
          })

        const urls = response.data;
        for (let index = 0; index < urls.length; index++) {
          await saveVideoCourse(urls[index].url, urls[index].videoId, index);
        }
      } catch (err) {
        console.log(err);
      }
    }
    setLoadingUploadVideo(false);
  }

  const selectVideos = async () => {

    if (videos.length >= 5 || thumbnailVideo.length >= 5) {
      Toast.show("Chỉ được chọn tối đã 5 video!", {
        type: "waring",
        duration: 1400
      }
      )
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        base64: true,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const formattedVideos: VideoType[] = await Promise.all(result.assets.map(async (asset) => {
          const videoSize: number = asset.fileSize ?? 0;
          const fileType: string = asset.mimeType ?? "video/mp4"

          var item = {
            uri: asset.uri,
            filename: asset.fileName || `video_${Date.now()}.mp4`,
            video_size: videoSize,
            fileType: fileType
          };

          return item;
        }));
        setVideos((prevState) => [...prevState, ...formattedVideos]);
        uploadVideos(formattedVideos);
      }
    } catch (err) {
      Toast.show("Bạn đã bỏ chọn video", {
        type: "warning",
        duration: 1400
      })
    };
  }

  const submitUploadVideoCourse = () => {
    postUploadVideos();
  }

  function toggleAccordion(videoKey: string) {
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeIn', property: 'opacity' },
      update: { type: 'linear', springDamping: 0.3, duration: 250 },
    });
    setOpened(prevState => ({
      ...prevState,
      [videoKey]: !prevState[videoKey]
    }));
  }

  const updateVideoCourse = (key: string, value: any, pos: number) => {

    setVideoUpload((prevState) =>
      prevState.map((item: any, index) => {
        if (index === pos) {
          return { ...item, [key]: value };
        }
        return item;
      }
      )
    )
  }

  const pickImage = async (pos: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setLoadingImage(true);
      const uriParts = result.assets[0].uri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      const fileType = `image/${fileName.split('.').pop()}`;
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        name: fileName,
        type: fileType,
      });
      await axios.post("https://upload.hightfive.click/upload/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
        .then((res) => {
          updateVideoCourse('image_url', res.data.url, pos)
          setLoadingImage(false);
        })
        .catch((err) => {
          console.log(err);
          updateVideoCourse(
            'image_url',
            defaultImage,
            pos
          );
          setLoadingImage(false);
        })
    }
    else {
      alert('Bạn chưa chọn hình ảnh nào');
    }
  };

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 50 }}
    >
      <View style={{
        paddingBottom: 20,
      }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 10,
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
            Thêm thông tin video
          </Text>
        </View>

        <TouchableOpacity
          style={{
            marginHorizontal: 10,
            marginTop: 20,
            backgroundColor: "#2865e3",
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 10,
          }}
          onPress={selectVideos}
        >
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <AntDesign
              name='addfile'
              size={28}
              color={"white"}
              style={{
                fontWeight: "bold",
                textAlign: "center"
              }}
            />
            <Text style={{
              color: 'white',
              fontFamily: "Nunito_700Bold",
              fontSize: 16,
              paddingLeft: 10,
            }}>Thêm video
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ flex: 2, marginHorizontal: 10 }}>

          {isLoading ? (
            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 100
            }}>
              <Text>Đang tải videos...</Text>
              <Progress.Circle style={{ marginTop: 15 }} progress={progress} size={90} />
            </View>
          ) : (
            <View>
              <View
                style={{
                  flexDirection: "column"
                }}
              >
                {videoUpload?.map((item, index) => (
                  <View key={index}>
                    <Image
                      source={{ uri: item?.image_url || "https://static-00.iconduck.com/assets.00/image-not-found-01-icon-2048x2048-95wsi7vg.png"}}
                      style={styles.video}
                    />
                    {/* <TouchableOpacity
                      onPress={() => pickImage(index)}
                      style={{
                        position: "absolute",
                        top: 30,
                        left: 20
                      }}>
                      <View style={{
                        backgroundColor: "#000000",
                        borderColor: "#dde2ec",
                        padding: 10,
                        borderRadius: 100,
                        width: 45,
                        height: 45,
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: 0.5
                      }}>
                        <FontAwesome
                          style={{ position: "absolute", left: 14, top: 15 }}
                          name="image"
                          size={15}
                          color={"white"}
                        />
                      </View>
                    </TouchableOpacity> */}

                    <View style={{
                      padding: 10,
                      backgroundColor: 'white',
                      borderRadius: 6,
                    }}>
                      <TouchableWithoutFeedback onPress={() => toggleAccordion(`video${index + 1}`)}>
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                          <Text style={{ fontWeight: "bold", fontSize: 20, paddingVertical: 5 }}>Thông tin video</Text>
                          <AntDesign name={opened[`video${index + 1}`] ? 'caretup' : 'caretdown'} size={16} />
                        </View>
                      </TouchableWithoutFeedback>

                      {opened[`video${index + 1}`] && (
                        <View style={{ marginTop: 8 }}>
                          <ScrollView keyboardShouldPersistTaps="handled">
                            <View style={styles.container}>
                              <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                  setModalVisible(!modalVisible);
                                }}>
                                <View style={styles.centeredView}>
                                  <View style={styles.modalView}>
                                    <Text style={{
                                      fontFamily: "Nunito_600SemiBold",
                                      fontSize: 20
                                    }}>
                                      Chế độ hiển thị
                                    </Text>
                                    <View style={{ marginTop: 30 }}>
                                      <TouchableOpacity
                                        disabled={isCheckPublic}
                                        onPress={() => handlePublicPress(index)}
                                        style={[isCheckPublic ? [commonStyles.checkBox,
                                        commonStyles.activeCheckbox] : commonStyles.checkBox, { width: 250 }]}>
                                        <MaterialIcons
                                          name={isCheckPublic ? "radio-button-checked" : "radio-button-unchecked"}
                                          size={24}
                                          color={"#2865e3"}
                                        />
                                        <Text style={{
                                          color: "#A1A1A1",
                                          fontSize: 16,
                                          marginLeft: 10
                                        }}>
                                          Công khai
                                        </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        disabled={false}
                                        onPress={() => handlePrivatePress(index)}
                                        style={isCheckPrivate ? [commonStyles.checkBox,
                                        commonStyles.activeCheckbox] : commonStyles.checkBox}>
                                        <MaterialIcons
                                          name={isCheckPrivate ? "radio-button-checked" : "radio-button-unchecked"}
                                          size={24}
                                          color={"#2865e3"}
                                        />
                                        <Text style={{
                                          color: "#A1A1A1",
                                          fontSize: 16,
                                          marginLeft: 10
                                        }}>
                                          Riêng tư
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                      style={{
                                        marginTop: 20,
                                        backgroundColor: "#2865e3",
                                        paddingHorizontal: 15,
                                        paddingVertical: 10,
                                        borderRadius: 10,
                                        width: 250,
                                      }}
                                      onPress={() => setModalVisible(!modalVisible)}
                                    >
                                      <Text style={{
                                        color: "white",
                                        textAlign: "center",
                                        fontSize: 18
                                      }}>Lưu</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </Modal>

                              <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisibleDesc}
                                onRequestClose={() => {
                                  setModalVisibleDesc(!modalVisibleDesc);
                                }}>
                                <View style={[styles.centeredView, { marginHorizontal: 20 }]}>
                                  <View style={[styles.modalView]}>
                                    <Text style={{
                                      fontFamily: "Nunito_700Bold",
                                      fontSize: 24
                                    }}>
                                      Thêm mô tả
                                    </Text>
                                    <View style={{ marginTop: 30 }}>
                                      <TextInput
                                        onChangeText={(value) => {
                                          updateVideoCourse('description', value, index)
                                        }
                                        }
                                        multiline={true}
                                        style={{
                                          height: 200,
                                          width: 325,
                                          fontSize: 16,
                                          justifyContent: "flex-start",
                                          textAlignVertical: 'top',
                                        }}
                                        placeholder="Nhập thông tin mô tả về video..."
                                      >
                                      </TextInput>
                                    </View>
                                    <TouchableOpacity
                                      style={{
                                        marginTop: 20,
                                        backgroundColor: "#2865e3",
                                        paddingHorizontal: 15,
                                        paddingVertical: 10,
                                        borderRadius: 10,
                                        width: 250,
                                      }}
                                      onPress={() => setModalVisibleDesc(false)}
                                    >
                                      <Text style={{
                                        color: "white",
                                        textAlign: "center",
                                        fontSize: 18
                                      }}>Lưu</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </Modal>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  marginBottom: 10,
                                  position: "relative",
                                  width: "100%",
                                  marginTop: 15,
                                }}
                              >
                              </View>
                            </View>
                            <View style={{
                              position: "relative"
                            }}>
                              <TouchableOpacity
                                // onPress={pickImage}
                                style={{
                                  position: "absolute",
                                  top: 17,
                                  left: 17
                                }}>
                              </TouchableOpacity>
                            </View>
                            <View style={{}}>
                              <TextInput
                                onChangeText={(value) =>
                                  updateVideoCourse('title', value, index)
                                }
                                style={{
                                  paddingLeft: 55,
                                  paddingRight: 25,
                                  height: 50,
                                  borderWidth: 1,
                                  borderColor: "#757575",
                                  fontSize: 18,
                                  fontWeight: "semibold",
                                  fontFamily: "Nunito_600SemiBold"
                                }}
                                keyboardType="default"
                                placeholder="Tiêu đề"
                                value={videoUpload[index].title}
                              />
                              <FontAwesome
                                style={{ position: "absolute", left: 15, top: 15 }}
                                name="id-card"
                                size={20}
                                color={"#A1A1A1"}
                              />
                            </View>
                            <View>
                              <TouchableOpacity
                                onPress={() => setModalVisibleDesc(!modalVisible)}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  style={{
                                    paddingLeft: 45,
                                    height: 55,
                                    fontSize: 20,
                                    alignItems: "center",
                                    paddingVertical: 15,
                                    fontFamily: "Nunito_600SemiBold"
                                  }}
                                >
                                  {videoUpload[index].description.length > 0 ?
                                    videoUpload[index].description.length > 27 ?
                                      videoUpload[index].description.substring(0, 27) + "..." :
                                      videoUpload[index].description :
                                    "Thêm mô tả"
                                  }
                                </Text>
                                <FontAwesome
                                  style={{ position: "absolute", left: 15, top: 20 }}
                                  name="align-left"
                                  size={20}
                                  color={"#A1A1A1"}
                                />
                                <TouchableOpacity>
                                  <AntDesign name="right" size={26} />
                                </TouchableOpacity>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  setModalVisible(true);
                                }}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <View style={{
                                  alignItems: "center",
                                  paddingLeft: 50,
                                  marginTop: 10,
                                }}>
                                  <Text>
                                    Chế độ hiển thị
                                  </Text>
                                  <Text
                                    style={{
                                      height: 50,
                                      fontSize: 20,
                                      paddingVertical: 15,
                                      lineHeight: 15,
                                      marginRight: 10,
                                      fontFamily: "Nunito_600SemiBold"
                                    }}
                                  >
                                    {
                                      videoUpload[index].status == 0 ?
                                        " Công khai" : "Riêng tư "
                                    }
                                  </Text>
                                </View>
                                <AntDesign
                                  style={{ position: "absolute", left: 15, top: 20 }}
                                  name={
                                    videoUpload[index].status == 0 ?
                                      "earth" : "lock"
                                  }
                                  size={25}
                                  color={"#A1A1A1"}
                                />
                                <TouchableOpacity>
                                  <AntDesign name="right" size={26} />
                                </TouchableOpacity>
                              </TouchableOpacity>

                              <View style={{
                                borderWidth: 1,
                                borderColor: "#757575",
                                padding: 10,
                              }}>
                                <TextInput
                                  style={{
                                    width: "100%",
                                    fontSize: 20,
                                    fontFamily: "Nunito_600SemiBold"
                                  }}
                                  placeholder="Thêm tag..."
                                  onChangeText={(value) => handleTextChange(value, index)}
                                  value={text[index]}
                                  multiline={true}
                                />
                              </View>
                              <View style={styles.tagsContainer}>
                                {videoUpload[index].tags.map((tag, index) => (
                                  <View key={index} style={styles.tag}>
                                    <Text style={{ color: "white" }}>{tag}</Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View>
            {!loadingUploadVideo ? (
              <TouchableOpacity
                onPress={submitUploadVideoCourse}
                disabled={videos.length > 0 ? false : true}
                style={{
                  marginVertical: 20,
                  backgroundColor: "#2865e3",
                  paddingHorizontal: 30,
                  paddingVertical: 15,
                  borderRadius: 10,
                }}
              >
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <AntDesign
                    name='save'
                    size={30}
                    color={'white'}
                    style={{
                      fontWeight: 'bold',
                      textAlign: "center"
                    }}
                  />
                  <Text
                    style={{
                      paddingLeft: 10,
                      color: "white",
                      fontFamily: "Nunito_700Bold",
                      fontSize: 16,
                    }}
                  >
                    Lưu Video
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 15
              }}>
                <Progress.Circle
                  style={{ marginTop: 15 }}
                  progress={progress}
                  showsText={true}
                  size={70} />
              </View>
            )}
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
    marginTop: 10
  },
  tag: {
    backgroundColor: '#757575',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  video: {
    marginTop: 20,
    width: "100%",
    height: 200,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#575757",
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    }
  }
})