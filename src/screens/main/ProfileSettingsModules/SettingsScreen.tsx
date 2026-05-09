import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Switch,
    useColorScheme,
    useWindowDimensions,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../hooks/ThemeContext";

import SettingsStyles from "../../../styles/SettingsScreenStyles";
import ProfileMenuItem from "../../../components/ProfileMenuItem";

import { RootStackParamList } from '../../../types/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type NavigationProp = NativeStackNavigationProp<
    RootStackParamList
>

export default function SettingsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { width } = useWindowDimensions();

    const { theme } = useTheme();
    const [notifications, setNotifications] = useState(true);

    return (
        <SafeAreaView
            style={[
                SettingsStyles.safeArea,
                { backgroundColor: theme.background },
            ]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={SettingsStyles.container}>

                    {/* HEADER */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={SettingsStyles.header}>
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={theme.text}
                        />

                        <Text
                            style={[
                                SettingsStyles.headerTitle,
                                { color: theme.text },
                            ]}
                        >
                            Settings
                        </Text>

                        <View style={{ width: 24 }} />
                    </TouchableOpacity>

                    {/* PREFERENCES */}
                    <Text style={[SettingsStyles.sectionTitle, { color: theme.subText }]}>
                        Preferences
                    </Text>

                    <View
                        style={[
                            SettingsStyles.menuCard,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >

                        {/* Notifications */}
                        <View style={[
                            SettingsStyles.row,
                            {
                                borderBottomColor: theme.border,
                            },
                        ]}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons
                                    name="notifications-outline"
                                    size={20}
                                    color={theme.text}
                                    style={{ marginRight: 10 }}
                                />

                                <Text style={[SettingsStyles.rowTitle, { color: theme.text }]}>
                                    Notifications
                                </Text>
                            </View>

                            <Switch value={notifications} onValueChange={setNotifications} />
                        </View>

                        {/* Currency */}
                        <ProfileMenuItem
                            icon="cash-outline"
                            title="Currency"
                            value="INR (₹)"
                            theme={theme}
                            onPress={() => console.log("Currency")}
                        />

                        {/* Language */}
                        <ProfileMenuItem
                            icon="language-outline"
                            title="Language"
                            value="English"
                            theme={theme}
                            hideBorder
                            onPress={() => console.log("Language")}
                        />
                    </View>

                    {/* DATA */}
                    <Text style={[SettingsStyles.sectionTitle, { color: theme.subText }]}>
                        Data
                    </Text>

                    <View
                        style={[
                            SettingsStyles.menuCard,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <ProfileMenuItem
                            icon="cloud-upload-outline"
                            title="Backup & Restore"
                            theme={theme}
                        />

                        <ProfileMenuItem
                            icon="download-outline"
                            title="Export Data"
                            theme={theme}
                            hideBorder
                        />
                    </View>

                    {/* ACCOUNT */}
                    <Text style={[SettingsStyles.sectionTitle, { color: theme.subText }]}>
                        Account
                    </Text>

                    <View
                        style={[
                            SettingsStyles.menuCard,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <ProfileMenuItem
                            icon="lock-closed-outline"
                            title="Change Password"
                            theme={theme}
                        />

                        <ProfileMenuItem
                            icon="trash-outline"
                            title="Delete Account"
                            theme={theme}
                            textColor="#EF4444"
                            hideBorder
                            onPress={() => console.log("Delete Account")}
                        />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView >
    );
}