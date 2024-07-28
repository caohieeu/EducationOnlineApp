import useUser from "@/hooks/useUser";
import { Redirect } from "expo-router";
import Loader from "@/loader/loader";

export default function TabsIndex() {
    const { loading, user } = useUser();
        
    return (
        <>
            {
                false ? (
                    <Loader />
                ) : (
                    <Redirect href={!user ? "/(routes)/onboarding" : "/(tabs)"} />
                )
            }
        </>
    )
}