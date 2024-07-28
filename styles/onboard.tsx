import { StyleSheet } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen'

export const styles = StyleSheet.create({
    firstContainer: {
        alignItems: "center",
        marginTop: 50,
    },
    logo: {
        width: wp("35%"),
        height: hp("22%")
    },
    titleWrapper: {
        flexDirection: "row"
    },
    titleText: {
        fontSize: hp("4%"),
        textAlign: "center"
    },
    dscpWrapper: {
        marginTop: 30
    },
    dscpText: {
        textAlign: "center",
        color: "#575757",
        fontSize: hp("2%")
    },
    buttonWrapper: {
        backgroundColor: "#2865e3",
        width: wp("92%"),
        paddingVertical: 18,
        borderRadius: 8,
        marginTop: 40
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    }
});