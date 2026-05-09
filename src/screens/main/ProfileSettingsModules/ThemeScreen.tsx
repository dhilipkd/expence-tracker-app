import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../hooks/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

import ThemesStyles from "../../../styles/ThemesScreenStyles";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../../../types/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Card from "../../../components/common/TCardStyle";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList
>

export default function ThemeScreen() {

    const { theme, mode, setMode } = useTheme();
    console.log("theme.background:", theme.background, "mode:", mode);

    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <View style={ThemesStyles.container}>

                    {/* HEADER */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={ThemesStyles.header}>
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={theme.text}
                        />

                        <Text
                            style={[
                                ThemesStyles.headerTitle,
                                { color: theme.text },
                            ]}
                        >
                            Themes
                        </Text>

                        <View style={{ width: 24 }} />
                    </TouchableOpacity>
                    <Card
                        icon="sunny-outline"
                        title="Light"
                        theme={theme}
                        textColor={mode === "light" ? "#22C55E" : theme.text}
                        onPress={() => setMode("light")}
                        showArrow={false}
                    />

                    {/* DARK */}
                    <Card
                        icon="moon-outline"
                        title="Dark"
                        theme={theme}
                        textColor={mode === "dark" ? "#22C55E" : theme.text}
                        onPress={() => setMode("dark")}
                        showArrow={false}
                    />

                    {/* SYSTEM */}
                    <Card
                        icon="phone-portrait-outline"
                        title="System Default"
                        theme={theme}
                        textColor={mode === "system" ? "#22C55E" : theme.text}
                        onPress={() => setMode("system")}
                        showArrow={false}
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}