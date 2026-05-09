import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    useWindowDimensions,
    RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../types/navigation.types';
import { useTheme } from "../../../hooks/ThemeContext";
import { useCategories } from "../../../hooks/useCategories";

import Card from "../../../components/common/TCardStyle";
import TPrimaryButton from "../../../components/common/TPrimaryButton";
import TLoader from "../../../components/common/TLoader";
import TConfirmDialog from "../../../components/common/TConfirmDialog";
import CustomToggle from "../../../components/common/TToggleButton";

import CustomCategoriesStyles from "../../../styles/CustomCategoryScreenStyles";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList
>

export default function CustomCategoryScreen() {

    const navigation = useNavigation<NavigationProp>();
    const { width } = useWindowDimensions();
    const { theme } = useTheme();

    const [type, setType] = useState<"expense" | "income">("expense");

    const toggleOptions: {
        label: string;
        value: "expense" | "income";
    }[] = [
            { label: "Expense", value: "expense" },
            { label: "Income", value: "income" },
        ];

    const handleTypeChange = (val: string) => {
        if (val === "expense" || val === "income") {
            setType(val);
        }
    };

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const {
        categories,
        loading,
        removeCategory,
        refreshing,
        refreshCategories,
    } = useCategories(type);

    return (
        <SafeAreaView
            style={[
                CustomCategoriesStyles.safeArea,
                {
                    backgroundColor: theme.background,
                },
            ]}
        >
            <View style={CustomCategoriesStyles.container}>

                {/* HEADER */}
                <View style={CustomCategoriesStyles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={theme.text}
                        />
                    </TouchableOpacity>

                    <Text
                        style={[
                            CustomCategoriesStyles.headerTitle,
                            {
                                color: theme.text,
                            },
                        ]}
                    >
                        Categories
                    </Text>

                    <View style={{ width: 24 }} />
                </View>

                <CustomToggle
                    options={toggleOptions}
                    value={type}
                    onChange={handleTypeChange}
                    theme={theme}
                />

                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 120,
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refreshCategories}
                        />
                    }
                    renderItem={({ item }) => (
                        <Card
                            title={item.title}
                            icon={item.icon}
                            color={item.color}
                            theme={theme}
                            showArrow={false}
                            onEdit={() =>
                                navigation.navigate(
                                    "CreateCategory",
                                    {
                                        category: item,
                                        type: type,
                                    } as any
                                )
                            }

                            onDelete={
                                !item.isDefault
                                    ? () => setDeleteId(item.id)
                                    : undefined
                            }
                        />
                    )}

                    ListEmptyComponent={() => (
                        <View
                            style={{
                                marginTop: 100,
                                alignItems: "center",
                            }}
                        >
                            <Ionicons
                                name="folder-open-outline"
                                size={60}
                                color={theme.subText}
                            />

                            <Text
                                style={{
                                    color: theme.subText,
                                    marginTop: 12,
                                }}
                            >
                                No Categories Found
                            </Text>
                        </View>
                    )}
                />

                {/* ADD BUTTON */}
                <View style={CustomCategoriesStyles.buttonView}>
                    <TPrimaryButton
                        title="Add Category"
                        theme={theme}
                        icon="add"
                        onPress={() =>
                            navigation.navigate("CreateCategory", {
                                type: type,
                            } as any)
                        }
                        style={{ width: width * 0.8, marginBottom: width * 0.09 }}
                    >
                    </TPrimaryButton>
                </View>
                <TLoader
                    visible={loading}
                    color={theme.primary}
                />
            </View>
            <TConfirmDialog
                visible={!!deleteId}
                title="Delete Category"
                message="Are you sure you want to delete this category?"
                theme={theme}
                onCancel={() => setDeleteId(null)}
                onConfirm={async () => {
                    if (deleteId) {
                        await removeCategory(deleteId);
                        setDeleteId(null);
                    }
                }}
            />
        </SafeAreaView>
    );
}