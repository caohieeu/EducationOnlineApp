import { Text, View, Image, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useFonts, Raleway_700Bold, Raleway_600SemiBold } from '@expo-google-fonts/raleway'
import { Nunito_400Regular, Nunito_700Bold, Nunito_600SemiBold } from "@expo-google-fonts/nunito"
import { styles } from '@/styles/login'
import { commonStyles } from '@/styles/common'
import { LinearGradient } from 'expo-linear-gradient'
import { Entypo, FontAwesome, Fontisto, Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

export default function SignupScreen() {
    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
        Raleway_600SemiBold,
        Nunito_600SemiBold
    })
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [userSignUp, setUserSignUp] = useState({
        email: "",
        username: "",
        displayName: "",
        password: "",
        role: ""
    })
    const [required, setRequired] = useState("");
    const [error, setError] = useState({
        password: ""
    })
    const [isCheckStudent, setIsCheckStudent] = useState(false);
    const [isCheckTeacher, setIsCheckTeacher] = useState(false);

    const handlePasswordValidation = (value:string) => {
        const password = value;
        const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
        const passwordOneNumber = /(?=.*[0-9])/;
        const passwordSixValue = /(?=.{6,})/;

        if(!passwordSpecialCharacter.test(password)) {
            setError({
                ...error,
                password: "Write at least one special character"
            })
        }
        else if(!passwordOneNumber.test(password)) {
            setError({
                ...error,
                password: "Write at least one number"
            })
        }
        else if(!passwordSixValue.test(password)) {
            setError({
                ...error,
                password: "Write at least 6 characters"
            })
        }
        else {
            setError({...error, password: ""})
            setUserSignUp({...userSignUp, password: password})
        }
    }

    const handleSignup = () => {
        setButtonSpinner(true);
        console.log(userSignUp.email);
        console.log(userSignUp.password);
        console.log(userSignUp.role);
        console.log(userSignUp.username);
        console.log(userSignUp.displayName);
    }

    const handleStudentPress = () => {
        setIsCheckStudent(!isCheckStudent);
        setUserSignUp({...userSignUp, role: "Student"})
        setIsCheckTeacher(false);
    }
    
    const handleTeacherPress = () => {
        setIsCheckTeacher(!isCheckTeacher);
        setUserSignUp({...userSignUp, role: "Teacher"})
        setIsCheckStudent(false);
    }

    return (
        <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{flex: 1}}>
            <ScrollView style={{paddingHorizontal: 23}}>
                <Image 
                    source={require("@/assets/images/header-image.png")}
                    style={styles.siginImage} />
                <Text style={[styles.welcomeText, {fontFamily: "Raleway_700Bold"}]}>
                    Let's get started!
                </Text>
                <Text style={styles.learningText}>
                    Create an account to Education Online to get all features
                </Text>
                <View style={commonStyles.inputContainer}>
                    <View style={{paddingBottom: 10}}>
                        <View>
                            <TextInput 
                                style={[commonStyles.input, {paddingLeft: 45}]}
                                keyboardType="default"
                                value={userSignUp.username}
                                placeholder="Username"
                                onChangeText={(value) => setUserSignUp({...userSignUp, username:value})}
                            />
                            <Fontisto 
                                style={{position: "absolute", left: 15, top: 17.8}}
                                name="person"
                                size={20}
                                color={"#A1A1A1"}
                            />
                        </View>
                        <View style={{marginTop: 15}}>
                            <TextInput 
                                style={[commonStyles.input, {paddingLeft: 45}]}
                                keyboardType="default"
                                value={userSignUp.displayName}
                                placeholder="Display name"
                                onChangeText={(value) => setUserSignUp({...userSignUp, displayName:value})}
                            />
                            <FontAwesome 
                                style={{position: "absolute", left: 15, top: 17.8}}
                                name="id-card"
                                size={20}
                                color={"#A1A1A1"}
                            />
                        </View>
                        <View style={{marginTop: 15}}> 
                            <TextInput 
                                style={[commonStyles.input, {paddingLeft: 45}]}
                                keyboardType="email-address"
                                value={userSignUp.email}
                                placeholder="youremail@gmail.com"
                                onChangeText={(value) => setUserSignUp({...userSignUp, email:value})}
                            />
                            <Fontisto 
                                style={{position: "absolute", left: 15, top: 17.8}}
                                name="email"
                                size={20}
                                color={"#A1A1A1"}
                            />
                            {required && (
                                <View style={commonStyles.errorContainer}>
                                    <Entypo name="cross" size={18} color={"red"} />
                                </View>
                            )}
                        </View>
                        <View style={{marginTop: 15}}>
                            <TextInput 
                                style={[commonStyles.input, {paddingLeft: 45}]}
                                keyboardType="default"
                                secureTextEntry={!isPasswordVisible}
                                defaultValue=""
                                placeholder="********"
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
                        <View style={[commonStyles.errorContainer, {top: 275}]}>
                            <Entypo name="cross" size={18} color={"red"} />
                            <Text style={{color: "red", fontSize: 14, marginTop: -1}}>
                                {error.password}
                            </Text>
                        </View>
                    )}

                        <View style={{marginTop: 30}}>
                            <TouchableOpacity
                                disabled={isCheckStudent}
                                onPress={() => handleStudentPress()}
                                style={isCheckStudent ? [commonStyles.checkBox, 
                                    commonStyles.activeCheckbox] : commonStyles.checkBox}>
                                <MaterialIcons 
                                    name={isCheckStudent ? "check-box" : "check-box-outline-blank"}
                                    size={24}
                                    color={"#2865e3"}
                                />
                                <Text style={{
                                    color: "#A1A1A1",
                                    fontSize: 16,
                                    marginLeft: 10
                                }}>
                                    Student
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={isCheckTeacher}
                                onPress={() => handleTeacherPress()}
                                style={isCheckTeacher ? [commonStyles.checkBox, 
                                    commonStyles.activeCheckbox] : commonStyles.checkBox}>
                                <MaterialIcons
                                    name={isCheckTeacher ? "check-box" : "check-box-outline-blank"}
                                    size={24}
                                    color={"#2865e3"}
                                />
                                <Text style={{
                                    color: "#A1A1A1",
                                    fontSize: 16,
                                    marginLeft: 10
                                }}>
                                    Teacher
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[commonStyles.buttonContainer, {marginTop: 7, marginBottom: -16}]}
                        onPress={handleSignup}
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
                                    Sign Up
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
                        Already have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(routes)/auth/signin")}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: "Raleway_600SemiBold",
                                color: "#2467EC",
                                marginLeft: 5
                            }}
                        >
                            Sign in
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    )
}