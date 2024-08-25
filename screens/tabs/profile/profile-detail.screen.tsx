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

export default function ProfileDetailScreen() {
    const { user, loading } = useUser();
    const [userEdt, setUserEdt] = useState({
        id: "",
        userName: "",
        email: "",
        isEmailActive: false,
        dislayName: "",
        password: "",
        role: "",
        avatarUrl: "",
        streamInfo: {
            last_stream: "",
            stream_token: "",
            status: ""
        }
    });
    const [edtDisplayname, setEdtDisplayname] = useState(false);
    const [edtUsername, setEdtUsername] = useState(false);
    const [edtEmail, setEdtEmail] = useState(false);

    useEffect(() => {
        setUserEdt({
            ...userEdt,
            id: user?.id,
            userName: user?.userName,
            email: user?.email,
            isEmailActive: user?.isEmailActive,
            dislayName: user?.dislayName,
            password: user?.password,
            role: user?.role,
            avatarUrl: user?.avatarUrl,
            streamInfo: {
                last_stream: user?.streamInfo.last_stream,
                stream_token: user?.streamInfo.stream_token,
                status: user?.streamInfo.status
            }
        });
    }, [user])

    const hidePassword = (password: string) => {
        var pass = "";
        for (var i = 0; i < password.length; i++) {
            pass += "*";
        }
        return pass;
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <LinearGradient
                    colors={["#E5ECF9", "#F6F7F9"]}
                    style={{ flex: 1, paddingTop: 80 }}
                >
                    <ScrollView>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <View style={{ position: "relative" }}>
                                <Image
                                    source={{
                                        uri: user?.avatarUrl ||
                                            "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                    }}
                                    style={{ width: 100, height: 100, borderRadius: 100 }} />
                                <TouchableOpacity
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
                                                onChangeText={(value) => setUserEdt({ ...userEdt, userName: value })}
                                                style={[{
                                                    color: "#575757",
                                                    fontFamily: "Nunito_400Regular",
                                                    padding: 0
                                                }]}
                                                value={userEdt.userName}
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
                                            value={hidePassword(userEdt.password)}
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
    }
})