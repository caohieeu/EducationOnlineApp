import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import UploadModal from '@/components/UploadModal';

interface TabLayoutProps {}

const TabLayout: React.FC<TabLayoutProps> = ({}) => {
    const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);

    const openUploadModal = () => {
        setUploadModalVisible(true);
    };

    const closeUploadModal = () => {
        setUploadModalVisible(false);
    };

    return (
        <>
            <Tabs
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => {
                        let iconName;
                        if (route.name === "index") {
                            iconName = require("@/assets/icons/home.png");
                        } else if (route.name === "profile/index") {
                            iconName = require("@/assets/icons/profile.png");
                        } else if (route.name === "upload/index") {
                            iconName = require("@/assets/icons/upload.png");
                        }
                        return (
                            <Image
                                style={{ width: 27, height: 25, tintColor: color }}
                                source={iconName}
                            />
                        );
                    },
                    headerShown: false,
                    tabBarShowLabel: false
                })}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="upload/index" listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        openUploadModal();
                    }
                })} />
                <Tabs.Screen name="profile/index" />
            </Tabs>

            <UploadModal visible={uploadModalVisible} onClose={closeUploadModal} />
        </>
    );
}

export default TabLayout;
