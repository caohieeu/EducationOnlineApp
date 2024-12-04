import { 
  StyleSheet, Text, View, Image, TouchableOpacity, 
  TextInput, Modal, Pressable, Button, ScrollView,
  ActivityIndicator
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles } from '@/styles/common';
import { LinearGradient } from 'expo-linear-gradient';
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
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { Toast } from 'react-native-toast-notifications';
import * as FileSystem from "expo-file-system";
import {Buffer} from "buffer";

export default function UploadVideo() {
  const videoRef = useRef<Video>(null);
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Raleway_600SemiBold,
    Nunito_600SemiBold
})
  const [video, setVideo] = useState<string | null>(null);
  const [addDesc, setAddDesc] = useState(false);
  const [image, setImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isCheckPublic, setIsCheckPublic] = useState(false);
  const [isCheckPrivate, setIsCheckPrivate] = useState(false);
  const [text, setText] = useState('');
  const [pressLoading, setPressLoading] = useState(false);
  const [contentType, setContentType] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [videoUpload, setVideoUpload] = useState<VideoUpload>({
    title: "",
    description: "",
    image_url: "",
    video_size: "",
    file_type: "",
    video_status: "public",
    tags: []
  })

  const renderTags = (inputText:string) => {
    const hashtagRegex = /\B#\w*[a-zA-Z]+\w*/g;
    const tags = text.match(hashtagRegex);

    if (tags) {
      const tagsWithoutHash = tags.map(tag => tag.substring(1));
      setVideoUpload(prevState => ({ ...prevState, tags: tagsWithoutHash }));
    } else {
      setVideoUpload(prevState => ({ ...prevState, tags: [] }));
    }
  };
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
    });

    if(!result.canceled) {
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
        setImage(res.data.url);
        setVideoUpload({...videoUpload, image_url: res.data.url});
        setLoadingImage(false);
      })
      .catch((err) => {
        console.log(err);
        setImage("https://imexpert.au/wp-content/uploads/2023/08/image-not-found.png");
        setLoadingImage(false);
      })
    }
    else {
        alert('Bạn chưa chọn hình ảnh nào');
    }
  };

  const handleTextChange = (inputText:string) => {
    setText(inputText);
    renderTags(inputText);
  };

  const handlePublicPress = () => {
    setIsCheckPublic(!isCheckPublic);
    setIsCheckPrivate(false);
    setVideoUpload({...videoUpload, video_status: "public"})
}

  const handlePrivatePress = () => {
      setIsCheckPrivate(!isCheckPrivate);
      setIsCheckPublic(false);
      setVideoUpload({...videoUpload, video_status: "private"})
  }

  const uploadToAws = async (preSignedUrl:string, videoId:string) => {
    try {
      if(video) {
        const base64 = await FileSystem.readAsStringAsync(video, {
          encoding: FileSystem.EncodingType.Base64});
        const buffer = Buffer.from(base64, "base64");
        await axios.put(preSignedUrl, buffer, {
          headers: {
            'Content-Type': 'video/mp4',
          }
        })
        .then((res) => {
          setPressLoading(false);
          Toast.show("Tải video lên thành công!", {
            type: "success",
            duration: 1400
          })
          router.push("/(tabs)")
        })
        .catch(async (res) => {
          await axios.delete(`${SERVER_URI}/api/Video/deleteVideo/${videoId}?uploaded=false`);
          setPressLoading(false);
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  const postUploadVideo = async () => {
    setPressLoading(true);
    const token = await AsyncStorage.getItem("access_token");
    if(token!="") {
      try {
        await axios.post(
          `${SERVER_URI}/api/Video/getPresignedUrl`,
          {
            title: videoUpload.title,
            description: videoUpload.description,
            image_url: videoUpload.image_url,
            video_size: videoUpload.video_size,
            file_type: videoUpload.file_type,
            tags: videoUpload.tags
          },
          {
            headers: {Cookie: token?.toString()}
          }
        )
        .then((response) => {
          uploadToAws(response.data.preSignedUrl, response.data.video.id)
        })
        .catch((error) => {
          setPressLoading(false);
          console.log(error);
        })
      } catch(err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    const sub = async () => {
      try {
        const info_video_storage = await AsyncStorage.getItem("info_video");
        const infor_video = JSON.parse(info_video_storage!);
        setVideo(infor_video.uri);
        setContentType(infor_video.mimeType);
        setVideoUpload({...videoUpload, video_size: infor_video.fileSize})
        setVideoUpload({...videoUpload, file_type: infor_video.type})
      } catch (err) {
        console.log("Error: " + err);
      }
    }
    sub();
  }, [])

  if(addDesc) {
    return (
      <View
        style={{flex: 1}}
      >
        <View style={{
          paddingTop: 50, 
          flex: 1,
          paddingHorizontal: 20,
        }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setAddDesc(false)
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
          <TextInput
            onChangeText={(text) =>
              setVideoUpload({...videoUpload, description: text})
            }
            style={{
              flex: 1, 
              justifyContent: "flex-start",
              textAlignVertical: 'top',
              marginTop: 15,
              fontSize: 18,
              paddingHorizontal: 10
            }}
            placeholder='Nhập mô tả của bạn về video của bạn'
            multiline={true}
            value={videoUpload.description}
          />
        </View>
      </View>
    )
  }
  else {
    return (
      <LinearGradient
        colors={["#E5ECF9", "#F6F7F9"]} 
        style={{flex: 1, paddingTop: 40}}
      >
        <ScrollView>
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
            <View style={{marginTop: 30}}>
                <TouchableOpacity
                    disabled={isCheckPublic}
                    onPress={() => handlePublicPress()}
                    style={[isCheckPublic ? [commonStyles.checkBox, 
                      commonStyles.activeCheckbox] : commonStyles.checkBox, {width: 250}]}>
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
                    onPress={() => handlePrivatePress()}
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
            <TouchableOpacity
              onPress={() => {
                router.push("(tabs)")
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
              Thêm chi tiết
            </Text>
            <TouchableOpacity
              onPress={postUploadVideo} 
              style={{
                backgroundColor: "#2865e3",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 25,
                position: "absolute",
                right: 0
              }}
            >
              {pressLoading ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text
                  style={{color: "white", fontSize: 15}}
                >
                  Tải lên
              </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{
          position: "relative"
        }}>
          {image=="" ? (
            <Video
              ref={videoRef}
              source={{ uri: video! }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
          />
          ) : (
            <>
              {loadingImage ? (
                <ActivityIndicator
                  size={'large'}
                  color={"#2865e3"}
                  style={styles.video}
                />
              ) : (
                <Image 
                  source={{ uri: image || "https://static-00.iconduck.com/assets.00/image-not-found-01-icon-2048x2048-95wsi7vg.png"}}
                  style={styles.video}
                />
              )}
            </>
          )} 
          <TouchableOpacity 
            onPress={pickImage}
            style={{
              position: "absolute",
              top: 17,
              left: 17
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
                style={{position: "absolute", left: 14, top: 15}}
                name="image"
                size={15}
                color={"white"}
              />
            </View>
        </TouchableOpacity>
        </View>
        <View style={{}}>
            <TextInput
              onChangeText={(text) => 
                setVideoUpload({...videoUpload, title: text})
              }
              style={{
                paddingLeft: 55,
                paddingRight: 25,
                height: 55,
                minHeight: 70,
                borderWidth: 1,
                borderColor: "#757575",
                fontSize: 23,
                fontWeight: "semibold",
                fontFamily: "Nunito_600SemiBold"
              }}
              keyboardType="default"
              placeholder="Tiêu đề"
              value={videoUpload.title}
            />
            <FontAwesome 
                style={{position: "absolute", left: 15, top: 25}}
                name="id-card"
                size={20}
                color={"#A1A1A1"}
            />
        </View>
        <View
          style={{
            margin: 10
          }}
        >
          <TouchableOpacity
            onPress={() => setAddDesc(!addDesc)}
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
                {videoUpload.description.length > 0 ? 
                  videoUpload.description.length > 27 ? 
                  videoUpload.description.substring(0, 27) + "..." :
                  videoUpload.description :
                  "Thêm mô tả"
                }
              </Text>
              <FontAwesome 
                  style={{position: "absolute", left: 15, top: 20}}
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
                    videoUpload.video_status=="public"?
                    " Công khai" : "Riêng tư "
                  }
                </Text>
              </View>
              <AntDesign 
                  style={{position: "absolute", left: 15, top: 20}}
                  name={
                    videoUpload.video_status == "public" ? 
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
          onChangeText={handleTextChange}
          value={text}
          multiline={true}
        />
    </View>
    <View style={styles.tagsContainer}>
          {videoUpload.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={{color: "white"}}>{tag}</Text>
            </View>
          ))}
      </View>
        </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },  
  video: {
    width: '100%',
    height: 245
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
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#757575',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 5,
    marginBottom: 5,
  },
});