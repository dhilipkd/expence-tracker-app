import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TKeyboardWrapper from "../../components/common/TKeyboardWrapper";
import TConfirmDialog from "../../components/common/TConfirmDialog";
import ProfileSettingsStyles from "../../styles/ProfileSettingsScreenStyles";

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logoutUser } from "../../services/authService";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../../types/navigation.types';

import { getAuth } from "firebase/auth";
import { useTheme } from "../../hooks/ThemeContext";
import Card from "../../components/common/TCardStyle";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList
>;

export default function ProfileSettingsScreen() {

    const navigation = useNavigation<NavigationProp>();
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        photo: "",
    });

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUserData({
                name: currentUser.displayName || "Guest User",
                email: currentUser.email || "No Email",
                photo: currentUser.photoURL || "",
            });
        }
    }, []);

    const user = {
        photoURL: null,
    };

    const userProfileImage = user?.photoURL || null;

    const handleLogout = async () => {
        const response = await logoutUser();
    };

    return (
        <SafeAreaView
            style={[
                ProfileSettingsStyles.safeArea,
                {
                    backgroundColor: theme.background,
                },
            ]}
        >
            <TKeyboardWrapper
                backgroundColor={theme.background}
                paddingHorizontal={0}
                style={{ paddingBottom: width * 0.30 }}
            >
                <View style={[ProfileSettingsStyles.container,
                {
                    paddingTop: width * 0.15,
                }
                ]}>

                    {/* PROFILE CARD */}
                    <View
                        style={[
                            ProfileSettingsStyles.profileCard,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <View style={ProfileSettingsStyles.profileRow}>
                            <Image
                                source={
                                    userProfileImage
                                        ? { uri: userProfileImage }
                                        : require("../../../assets/profile.png")
                                }
                                style={ProfileSettingsStyles.profileImage}
                            />

                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        ProfileSettingsStyles.userName,
                                        {
                                            color: theme.text,
                                        },
                                    ]}
                                >
                                    {userData.name}
                                </Text>

                                <Text
                                    style={[
                                        ProfileSettingsStyles.userEmail,
                                        {
                                            color: theme.subText,
                                        },
                                    ]}
                                >
                                    {userData.email}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Card
                        icon="person-circle-outline"
                        title="My Profile"
                        theme={theme}
                        onPress={() => console.log("Profile")}
                    />

                    <Card
                        icon="pricetag-outline"
                        title="Customize Category"
                        theme={theme}
                        onPress={() => navigation.navigate("CustomCategory")}
                    />

                    <Card
                        icon="color-palette-outline"
                        title="Themes"
                        theme={theme}
                        onPress={() => navigation.navigate("Themes")}
                    />

                    <Card
                        icon="settings-outline"
                        title="Settings"
                        theme={theme}
                        onPress={() => navigation.navigate("Settings")}
                    />

                    {/* LOGOUT */}
                    <TouchableOpacity
                        onPress={() => setShowLogoutDialog(true)}
                        style={[
                            ProfileSettingsStyles.logoutButton,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <Text style={ProfileSettingsStyles.logoutText}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                    <TConfirmDialog
                        visible={showLogoutDialog}
                        title="Logout"
                        message="Are you sure you want to logout?"
                        theme={theme}
                        onCancel={() => setShowLogoutDialog(false)}
                        onConfirm={async () => {
                            setShowLogoutDialog(false);
                            await handleLogout();
                        }}
                    />
                </View>
            </TKeyboardWrapper>
        </SafeAreaView >
    );
}