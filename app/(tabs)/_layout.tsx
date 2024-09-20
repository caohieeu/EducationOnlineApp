import React, { useState } from 'react';
import { router, Tabs } from 'expo-router';
import { Image } from 'react-native';
import UploadModal from '@/components/UploadModal';
import useUser from '@/hooks/useUser';

interface TabLayoutProps {}

const TabLayout: React.FC<TabLayoutProps> = () => {
    const { user, loading } = useUser();
    const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);

    const openUploadModal = () => {
        setUploadModalVisible(true);
    };

    const closeUploadModal = () => {
        setUploadModalVisible(false);
    };

    if (loading) {
        return null; // Return nothing while loading
    }

    return (
        <>
            <Tabs
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => {
                        let iconName;
                        switch (route.name) {
                            case "index":
                                iconName = require("@/assets/icons/home.png");
                                break;
                            case "upload/index":
                                iconName = require("@/assets/icons/upload.png")
                                break;
                            case "student-courses/index":
                                iconName = require("@/assets/icons/book.png");
                                break;
                            case "room/index":
                                iconName = require("@/assets/icons/camcorder.png")
                                break;
                            case "profile/index":
                                iconName = require("@/assets/icons/profile.png");
                                break;
                            default:
                                iconName = null;
                        }
                        return iconName ? (
                            <Image
                                style={{ width: 27, height: 25, tintColor: color }}
                                source={iconName || "https://static-00.iconduck.com/assets.00/image-not-found-01-icon-2048x2048-95wsi7vg.png"}
                            />
                        ) : null;
                    },
                    headerShown: false,
                    tabBarShowLabel: false
                })}
            >
                <Tabs.Screen name="index" />

                <Tabs.Screen
                    name="upload/index"
                    options={{ headerShown: false,
                        href: !(user?.role == "Teacher") ? null : 
                        "(tabs)/upload"  }}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            if(user?.role == "Teacher") {
                                event.preventDefault();
                                openUploadModal();
                            }
                        }
                    })}
                />

                <Tabs.Screen
                    name="student-courses/index"
                    options={{ headerShown: false,
                        href: !(user?.role == "Student") ? null : 
                        "(tabs)/student-courses"  }}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            if(user?.role == "Teacher") {
                                event.preventDefault();
                                openUploadModal();
                            }
                        }
                    })}
                />

                <Tabs.Screen name="room/index" />
                <Tabs.Screen name="profile/index" />
            </Tabs>

            <UploadModal visible={uploadModalVisible} onClose={closeUploadModal} />
        </>
    );
}

export default TabLayout;
