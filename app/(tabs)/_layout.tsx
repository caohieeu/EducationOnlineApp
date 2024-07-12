import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {
    
    return (
        <Tabs screenOptions={({ route }) => {
            return {
                tabBarIcon: ({ color }) => {
                    let iconName;
                    if(route.name === "index") {
                        iconName = require("@/assets/icons/home.png")
                    }
                    else if(route.name === "profile/index") {
                        iconName = require("@/assets/icons/profile.png")
                    }
                    return (
                        <Image
                            style={{ width: 25, height: 25, tintColor: color }}
                            source={iconName}
              />
                    )
                },
                headerShown: false,
                tabBarShowLabel: false
            }
        }}>
            <Tabs.Screen name="index" />
            <Tabs.Screen name="profile/index" />
        </Tabs>
    )
}