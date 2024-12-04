import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    TextInput
} from 'react-native'
import React, { useEffect, useState } from 'react'
import useUser from '@/hooks/useUser'
import Loader from '@/loader/loader';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderScreen from '@/components/HeaderScreen';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import useUpdateUser from '@/hooks/useUpdateUser';

export default function ProfileDetailScreen() {
    const { user, loading } = useUser();
    const [userEdt, setUserEdt] = useState({
        id: "",
        email: "",
        dislayName: "",
        avatarUrl: "",
    });
    const [edtDisplayname, setEdtDisplayname] = useState(false);
    const [edtUsername, setEdtUsername] = useState(false);
    const [edtEmail, setEdtEmail] = useState(false);
    const { subscription } = useUpdateUser(userEdt);

    useEffect(() => {
        setUserEdt({
            ...userEdt,
            id: user?.id,
            email: user?.email,
            dislayName: user?.dislayName,
            avatarUrl: user?.avatarUrl,
        });
    }, [user])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
        });
    
        if(!result.canceled) {
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
            setUserEdt({...userEdt, avatarUrl: res.data.url});
          })
          .catch((err) => {
            console.log(err);
            setUserEdt({...userEdt, avatarUrl: "https://imexpert.au/wp-content/uploads/2023/08/image-not-found.png"});
          })
        }
        else {
            alert('Bạn chưa chọn hình ảnh nào');
        }
      };

    const hidePassword = (password: string) => {
        var pass = "";
        for (var i = 0; i < password.length; i++) {
            pass += "*";
        }
        return pass;
    }

    const handleSave = () => {
        subscription();
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <LinearGradient
                    colors={["#E5ECF9", "#F6F7F9"]}
                    style={{ flex: 1 }}
                >
                    <HeaderScreen titleHeader="Thông tin người dùng" />
                    <ScrollView>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <View style={{ position: "relative" }}>
                                <Image
                                    source={{
                                        uri: userEdt.avatarUrl ||
                                            "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                    }}
                                    style={{ width: 100, height: 100, borderRadius: 100 }} />
                                <TouchableOpacity
                                    onPress={pickImage}
                                    style={styles.iconEditImage}
                                >
                                    <Ionicons
                                        name="camera-outline" size={25} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{ flexDirection: "row", justifyContent: "center" }}
                        >
                            <View style={{ position: "relative", marginHorizontal: 140 }}>
                                <TextInput
                                    editable={edtDisplayname}
                                    onChangeText={(value) => setUserEdt({ ...userEdt, dislayName: value })}
                                    style={styles.textDisplayName}
                                    value={userEdt.dislayName}
                                />
                                <TouchableOpacity
                                    style={{ position: "absolute", bottom: 0, right: -30 }}
                                    onPress={() => setEdtDisplayname(!edtDisplayname)}
                                >
                                    <Ionicons
                                        name="create-outline" size={25} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ marginHorizontal: 12, marginTop: 30 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 20
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        columnGap: 30
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
                                        <MaterialCommunityIcons
                                            style={{ alignSelf: "center" }}
                                            name="account"
                                            size={20}
                                            color={"black"} />
                                    </View>
                                    <View>
                                        <Text
                                            style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}
                                        >
                                            Username
                                        </Text>
                                        <View style={[edtUsername ? styles.editOn : null]}>
                                            <TextInput
                                                editable={edtUsername}
                                                // onChangeText={(value) => setUserEdt({ ...userEdt, userName: value })}
                                                style={[{
                                                    color: "#575757",
                                                    fontFamily: "Nunito_400Regular",
                                                    padding: 0
                                                }]}
                                                value={user?.userName}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setEdtUsername(!edtUsername)}
                                >
                                    <Ionicons name="create-outline" size={26} />
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    paddingTop: 10,
                                    borderTopWidth: 1,
                                    borderTopColor: "#CBD5E0",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 20
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        columnGap: 30
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
                                        <MaterialCommunityIcons
                                            style={{ alignSelf: "center" }}
                                            name="email"
                                            size={20}
                                            color={"black"} />
                                    </View>
                                    <View>
                                        <Text
                                            style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}
                                        >
                                            Email
                                        </Text>
                                        <View style={[edtEmail ? styles.editOn : null]}>
                                            <TextInput
                                                editable={edtEmail}
                                                onChangeText={(value) => setUserEdt({ ...userEdt, email: value })}
                                                style={[{
                                                    color: "#575757",
                                                    fontFamily: "Nunito_400Regular",
                                                    padding: 0
                                                }]}
                                                value={userEdt.email}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setEdtEmail(!edtEmail)}
                                >
                                    <Ionicons name="create-outline" size={26} />
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    paddingTop: 10,
                                    borderTopWidth: 1,
                                    borderTopColor: "#CBD5E0",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 20
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        columnGap: 30
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
                                        <MaterialCommunityIcons
                                            style={{ alignSelf: "center" }}
                                            name="lock"
                                            size={20}
                                            color={"black"} />
                                    </View>
                                    <View>
                                        <Text
                                            style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}
                                        >
                                            Password
                                        </Text>
                                        <TextInput
                                            onChangeText={(value) => setUserEdt({ ...userEdt, userName: value })}
                                            style={[{
                                                color: "#575757",
                                                fontFamily: "Nunito_400Regular",
                                                paddingBottom: 0
                                            }]}
                                            value={hidePassword(user?.password)}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => { }}
                                >
                                    <Ionicons name="create-outline" size={26} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ marginHorizontal: 12, marginTop: 20 }}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveButtonText}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </LinearGradient>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    iconEditImage: {
        position: "absolute",
        right: 0,
        bottom: 5,
        width: 30,
        height: 30,
        backgroundColor: "#f5f5f5",
        borderRadius: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    textDisplayName: {
        textAlign: "center",
        fontSize: 25,
        paddingTop: 10,
        fontWeight: "600"
    },
    itemProfile: {
        marginBottom: 20
    },
    editOn: {
        borderBottomWidth: 1,
        borderBottomColor: "#2467EC"
    },
    saveButton: {
        backgroundColor: "#2467EC",
        padding: 15,
        borderRadius: 8,
        alignItems: "center"
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    }
})