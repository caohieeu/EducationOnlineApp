import useUser from "@/hooks/useUser";
import { Redirect } from "expo-router";
import Loader from "@/loader/loader";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabsIndex() {
    const { loading, user } = useUser();

    useEffect(() => {
        const func = async () => {
            const token = await AsyncStorage.getItem("access_token");
        }
        func();
    }, [])

    return (
        <>
            {
                loading ? (
                    <Loader />
                ) : (
                    <Redirect href={user == null ? "/(routes)/onboarding" : "/(tabs)"} />
                )
            }
        </>
    )
}