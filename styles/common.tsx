import { StyleSheet } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen'

export const commonStyles = StyleSheet.create({
    containerCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems:"center"
    },
    buttonContainer: {
        backgroundColor: "#2865e3",
        width: "100%",
        paddingVertical: 18,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontFamily: "Raleway_700Bold"
    },
    buttonText_2: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: "Raleway_700Bold"
    },
    inputContainer: {
        marginTop: 30,
        rowGap: 30,
    },
    input: {
        height: 55,
        borderRadius: 8,
        paddingLeft: 35,
        fontSize: 16,
        backgroundColor: "white",
        color: "#A1A1A1"
    },
    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: 60
    },
    iconPassword: {
        position: "absolute",
        left: 24,
        top: 17.8,
        marginTop: -2
    },
    checkBox: {
        flexDirection: "row",
        alignContent: "center",
        paddingLeft: 15,
        marginTop: 15,
        paddingVertical: 18,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: "white",
    },
    activeCheckbox: {
        backgroundColor: "#06b6d4" + "11"
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})