import { StyleSheet } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen'

export const styles = StyleSheet.create({
    siginImage: {
        width: "90%",
        height: 225,
        alignSelf: "center",
        marginTop: 50
    },
    welcomeText: {
        textAlign: "center",
        fontSize: 24
    },
    learningText: {
        textAlign: "center",
        color: "#575757",
        fontSize: 15,
        marginTop: 5
    },
    visibleIcon: {
        position: "absolute",
        right: 30,
        top: 15,
    },
    iconPassword: {
        position: "absolute",
        left: 15,
        top: 17.8,
        marginTop: -2
    },
    forgotSection: {
        textAlign: "right",
        fontSize: 16,
        marginTop: -25
    },
    signUpRedirect: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    }
})