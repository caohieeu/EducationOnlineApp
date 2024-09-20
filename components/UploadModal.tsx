import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UploadModalProps {
    visible: boolean;
    onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ visible, onClose }) => {
    const [image, setImage] = useState("");

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            base64: true,
            quality: 1,
        });
    
        if(!result.canceled) {
            setImage(result.assets[0].uri);
            await AsyncStorage.setItem("info_video", JSON.stringify(result.assets[0]));
            onClose();
            router.push({
                pathname: "(routes)/upload/upload-video",
            });
        }
        else {
            alert('You did not select any image');
        }
      };
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={{
                        
                        width: "100%",
                            position: "relative"
                    }}>
                        <View style={{
                            flexDirection: "row",
                            marginBottom: 20,
                            width: "100%",
                        }}>
                            <Text style={{
                                fontWeight: 800, 
                                fontSize: 20,

                            }}>Tạo</Text>
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    right: 0
                                }}
                                onPress={onClose}
                            >
                                <MaterialCommunityIcons 
                                    size={30}
                                    name="close"
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={pickImage}
                            style={{
                                marginBottom: 15
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: 20,
                                }}
                            >
                                <View
                                    style={{
                                        borderWidth: 2,
                                        borderColor: "#dde2ec",
                                        padding: 15,
                                        borderRadius: 100,
                                        width: 55,
                                        height: 55
                                    }}
                                >
                                    <FontAwesome
                                        style={{alignSelf: "center"}}
                                        name="upload"
                                        size={20} 
                                        color={"black"} />
                                </View>
                                <View>
                                    <Text
                                        style={{fontSize: 16, fontFamily: "Nunito_700Bold"}}
                                    >
                                        Tải lên video
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                onClose();
                                router.push("(routes)/upload/upload-course")
                            }}
                            style={{
                                marginBottom: 15
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: 20,
                                }}
                            >
                                <View
                                    style={{
                                        borderWidth: 2,
                                        borderColor: "#dde2ec",
                                        padding: 15,
                                        borderRadius: 100,
                                        width: 55,
                                        height: 55
                                    }}
                                >
                                    <FontAwesome
                                        style={{alignSelf: "center"}}
                                        name="plus"
                                        size={20} 
                                        color={"black"} />
                                </View>
                                <View>
                                    <Text
                                        style={{fontSize: 16, fontFamily: "Nunito_700Bold"}}
                                    >
                                        Thêm khóa học
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
        maxHeight: '50%',
        alignItems: "flex-start",
    },
});

export default UploadModal;
