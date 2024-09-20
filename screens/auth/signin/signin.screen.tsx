import { Text, View, Image, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useFonts, Raleway_700Bold, Raleway_600SemiBold } from '@expo-google-fonts/raleway'
import { Nunito_400Regular, Nunito_700Bold, Nunito_600SemiBold } from "@expo-google-fonts/nunito"
import { styles } from '@/styles/login'
import { commonStyles } from '@/styles/common'
import { LinearGradient } from 'expo-linear-gradient'
import { Entypo, FontAwesome, Fontisto, Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-notifications'

export default function SigninScreen() {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Raleway_600SemiBold,
        Nunito_600SemiBold
    })
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: ""
    })
    const [required, setRequired] = useState("");
    const [error, setError] = useState({
        password: ""
    })

    const handlePasswordValidation = (value:string) => {
        const password = value;
        const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
        const passwordOneNumber = /(?=.*[0-9])/;
        const passwordSixValue = /(?=.{6,})/;

        if(!passwordSpecialCharacter.test(password)) {
            setError({
                ...error,
                password: "Có ít nhất 1 ký tự đặc biệt"
            })
        }
        else if(!passwordOneNumber.test(password)) {
            setError({
                ...error,
                password: "Có ít nhất 1 chữ số"
            })
        }
        else if(!passwordSixValue.test(password)) {
            setError({
                ...error,
                password: "Có ít nhất 6 ký tự"
            })
        }
        else {
            setError({...error, password: ""})
        }
        setUserInfo({...userInfo, password: password});
    }

    const handleSigin = async () => {
        console.log(`${SERVER_URI}/api/User/auth`);
        setButtonSpinner(true);
        if(validateInput(userInfo.username, userInfo.password)) {
            console.log(userInfo.username + " - " + userInfo.password)
            await axios
            .post(`${SERVER_URI}/api/User/auth`, {
                userName: userInfo.username,
                password: userInfo.password,
            })
            .then(async (res) => {
                const token = res.headers["set-cookie"];
                await AsyncStorage.setItem('access_token', JSON.stringify(token));
                setButtonSpinner(false);
                router.push("/(tabs)");
            })
            .catch((err) => {
                setButtonSpinner(false);
                Toast.show("Sai tài khoản hoặc mật khẩu!", {
                    type: "danger",
                    duration: 1400
                });
            })
        }
    }

    var validateInput = (usernameField:string, passwordField:string) => {
        if(usernameField.trim().length === 0 || passwordField.trim().length === 0) {
            Toast.show("Vui lòng nhập tên đăng nhập và mật khẩu!", {
                type: "warning",
                duration: 1400
            })
            setButtonSpinner(false);
            return false;
        }
        return true;
    }

    if(!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{flex: 1}}>
            <ScrollView style={{paddingHorizontal: 23}}>
                <Image 
                    source={require("@/assets/images/header-image.png")}
                    style={styles.siginImage} />
                <Text style={[styles.welcomeText, {fontFamily: "Raleway_700Bold"}]}>
                    Đăng nhập
                </Text>
                <Text style={styles.learningText}>
                    Đăng nhập tài khoản của bạn trong Education Online
                </Text>
                <View style={commonStyles.inputContainer}>
                    <View style={{paddingBottom: 10}}>
                        <TextInput 
                            style={[commonStyles.input, {paddingLeft: 45}]}
                            keyboardType="default"
                            value={userInfo.username}
                            placeholder="Tên đăng nhập"
                            onChangeText={(value) => setUserInfo({...userInfo, username:value})}
                        />
                        <Fontisto 
                            style={{position: "absolute", left: 15, top: 17.8}}
                            name="person"
                            size={20}
                            color={"#A1A1A1"}
                        />
                        {required && (
                            <View style={commonStyles.errorContainer}>
                                <Entypo name="cross" size={18} color={"red"} />
                            </View>
                        )}
                        <View style={{marginTop: 15}}>
                            <TextInput 
                                style={[commonStyles.input, {paddingLeft: 45}]}
                                keyboardType="default"
                                secureTextEntry={!isPasswordVisible}
                                defaultValue=""
                                placeholder="Mật khẩu"
                                onChangeText={handlePasswordValidation}
                            />
                            <TouchableOpacity
                                style={styles.visibleIcon}
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                {isPasswordVisible ? (
                                    <Ionicons 
                                        name="eye-off-outline"
                                        size={23}
                                        color={"#747474"}
                                    />
                                ) : (
                                    <Ionicons 
                                        name="eye-outline"
                                        size={23}
                                        color={"#747474"}
                                    />
                                )}
                            </TouchableOpacity>
                            <SimpleLineIcons 
                                style={styles.iconPassword}
                                name="lock"
                                size={20}
                                color={"#A1A1A1"}
                            />
                        </View>
                        {error.password && (
                        <View style={[commonStyles.errorContainer, {top: 140}]}>
                            <Entypo name="cross" size={18} color={"red"} />
                            <Text style={{color: "red", fontSize: 14, marginTop: -1}}>
                                {error.password}
                            </Text>
                        </View>
                    )}
                    </View>
                    
                    <TouchableOpacity
                        onPress={() => console.log("forgot password")}
                    >
                        <Text
                            style={[styles.forgotSection, {fontFamily: "Nunito_600SemiBold"}]}
                        >
                            Quên mật khẩu?
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[commonStyles.buttonContainer, {marginTop: -10, marginBottom: -16}]}
                        onPress={handleSigin}
                    >
                        {
                            buttonSpinner ? (
                                <ActivityIndicator size={"small"} color={"white"} />
                            ) : (
                                <Text 
                                    style={{
                                        color: "white", 
                                        textAlign: "center", 
                                        fontSize: 16, 
                                        fontFamily: "Raleway_700Bold"
                                    }}
                                >
                                    Đăng nhập
                                </Text>
                            )
                        }
                    </TouchableOpacity>

                    <View 
                        style={{
                            flexDirection: "row", 
                            alignItems: "center", 
                            justifyContent: "center",
                            marginVertical: 15
                        }}>
                        <FontAwesome name="google" size={24} />
                    </View>
                </View>
                <View style={styles.signUpRedirect}>
                    <Text style={{fontSize: 18, fontFamily: "Raleway_600SemiBold"}}>
                        Không có tài khoản?
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(routes)/auth/signup")}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: "Raleway_600SemiBold",
                                color: "#2467EC",
                                marginLeft: 5
                            }}
                        >
                            Đăng ký
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    )
}