import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../types/navigation.types";
import { useTheme } from "../../../hooks/ThemeContext";

import TKeyboardWrapper from "../../../components/common/TKeyboardWrapper";
import TCustomInputField from "../../../components/common/TCustomInputField";
import TPrimaryButton from "../../../components/common/TPrimaryButton";

import ColorPicker from "react-native-wheel-color-picker";
import { ICONS } from "../../../constants/Icons"

import { createCategory, updateCategory } from "../../../services/categoryService";
import TLoader from "../../../components/common/TLoader";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList
>;

const COLORS = [
    "#EF4444",
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#9CA3AF",

    "#FFE4E6",
    "#DBEAFE",
    "#DCFCE7",
    "#FEF9C3",
    "#F3E8FF",
];

export default function CreateCategoryScreen() {

    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<any>();
    const type = route.params?.type || "expense";

    const { theme } = useTheme();
    const { width } = useWindowDimensions();

    const [categoryName, setCategoryName] = useState("");
    const [focused, setFocused] = useState(false);

    const editCategory = route.params?.category;
    const isEdit = !!editCategory;

    const [selectedIcon, setSelectedIcon] = useState("apps-outline");
    const [selectedColor, setSelectedColor] = useState("#22C55E");

    const [loading, setLoading] = useState(false);
    const [showAllIcons, setShowAllIcons] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const MAX_VISIBLE = 9;

    const orderedIcons = [
        selectedIcon,
        ...ICONS.filter((i) => i !== selectedIcon),
    ];

    const visibleIcons = showAllIcons
        ? orderedIcons
        : orderedIcons.slice(0, MAX_VISIBLE);

    const MAX_COLORS = 9;

    const orderedColors = [
        selectedColor,
        ...COLORS.filter((c) => c !== selectedColor),
    ];

    const visibleColors = orderedColors.slice(0, MAX_COLORS);

    const isLightColor = (color: string) => {
        const c = color.substring(1);
        const rgb = parseInt(c, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 180;
    };

    useEffect(() => {
        if (editCategory) {
            setCategoryName(editCategory.title);
            setSelectedIcon(editCategory.icon);
            setSelectedColor(editCategory.color);
        }
    }, [editCategory]);

    const handleSave = async () => {
        if (!categoryName.trim()) {
            Alert.alert("Error", "Category name required");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title: categoryName,
                icon: selectedIcon,
                color: selectedColor,
                type,
                isDefault: false,
                createdAt: new Date().toISOString(),
            };

            if (isEdit) {
                await updateCategory({ id: editCategory.id, ...payload });
            } else {
                await createCategory(payload);
            }

            navigation.goBack();

        } catch (error: any) {
            Alert.alert("Error", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background,
            }}
        >
            <TKeyboardWrapper
                backgroundColor={theme.background}
                paddingHorizontal={20}
                style={{ paddingTop: 15 }}
            >
                <View style={{ justifyContent: "center" }}>

                    {/* HEADER */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 30,
                        }}
                    >
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
                            style={{
                                color: theme.text,
                                fontSize: 20,
                                fontWeight: "700",
                            }}
                        >
                            {isEdit ? "Update Category" : "Create Category"}
                        </Text>

                        <View style={{ width: 24 }} />
                    </View>

                    {/* INPUT */}
                    <TCustomInputField
                        label="Category Name"
                        placeholder="Enter category name"
                        value={categoryName}
                        onChangeText={setCategoryName}
                        theme={theme}
                        focused={focused}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />

                    {/* ICON PICKER */}
                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 16,
                            fontWeight: "600",
                            marginBottom: 14,
                            marginTop: 10,
                        }}
                    >
                        Select Icon
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginBottom: 25,
                        }}
                    >
                        {visibleIcons.map((icon) => {
                            const selected = selectedIcon === icon;
                            return (
                                <TouchableOpacity
                                    key={icon}
                                    onPress={() => setSelectedIcon(icon)}
                                    style={{
                                        width: "18%",
                                        height: "18%",
                                        aspectRatio: 1,
                                        borderRadius: 30,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: "1%",

                                        backgroundColor: selected ? selectedColor : theme.card,

                                        borderWidth: selected ? 2 : 1,
                                        borderColor: selected ? selectedColor : theme.border,
                                    }}
                                >
                                    <Ionicons
                                        name={icon as any}
                                        size={20}
                                        color={selected ? "#fff" : theme.text}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                        {!showAllIcons && (
                            <TouchableOpacity
                                onPress={() => setShowAllIcons(true)}
                                style={{
                                    width: "18%",
                                    height: "18%",
                                    aspectRatio: 1,
                                    borderRadius: 30,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "1%",
                                    backgroundColor: theme.card,
                                    borderWidth: 1,
                                    borderColor: theme.border,
                                }}
                            >
                                <Ionicons name="add" size={18} color={theme.primary} />
                                <Text style={{ fontSize: 11, color: theme.primary }}>
                                    More
                                </Text>
                            </TouchableOpacity>
                        )}

                        {showAllIcons && (
                            <TouchableOpacity
                                onPress={() => setShowAllIcons(false)}
                                style={{
                                    width: "18%",
                                    height: "18%",
                                    aspectRatio: 1,
                                    borderRadius: 30,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "1%",
                                    backgroundColor: theme.card,
                                    borderWidth: 1,
                                    borderColor: theme.border,
                                }}
                            >
                                <Ionicons name="chevron-up" size={18} color={theme.primary} />
                                <Text style={{ fontSize: 11, color: theme.primary }}>
                                    Less
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* COLOR PICKER */}
                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 16,
                            fontWeight: "600",
                            marginBottom: 14,
                        }}
                    >
                        Select Color
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginBottom: 15,
                        }}
                    >
                        {visibleColors.map((color) => {
                            const selected = selectedColor === color;

                            return (
                                <TouchableOpacity
                                    key={color}
                                    onPress={() => setSelectedColor(color)}
                                    style={{
                                        width: "18%",
                                        height: "18%",
                                        aspectRatio: 1,
                                        borderRadius: 32,
                                        margin: "1%",

                                        borderWidth: selected ? 3 : 1,
                                        borderColor: selected ? color : theme.border,

                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: "80%",
                                            height: "80%",
                                            borderRadius: 999,
                                            backgroundColor: color,
                                        }}
                                    />
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity
                            onPress={() => setShowColorPicker(true)}
                            style={{
                                width: "18%",
                                height: "18%",
                                aspectRatio: 1,
                                borderRadius: 32,
                                margin: "1%",
                                backgroundColor: theme.card,
                                borderWidth: 1,
                                borderColor: theme.border,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons name="color-palette-outline" size={18} color={theme.primary} />
                            <Text style={{ fontSize: 11, color: theme.primary }}>
                                Pick
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* PREVIEW */}
                    <View
                        style={{
                            backgroundColor: theme.card,
                            borderRadius: 18,
                            padding: 15,
                            marginBottom: 35,

                            borderWidth: 1,
                            borderColor: theme.border,
                        }}
                    >
                        <Text
                            style={{
                                color: theme.subText,
                                marginBottom: 14,
                            }}
                        >
                            Preview
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    backgroundColor: selectedColor,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 14,
                                }}
                            >
                                <Ionicons
                                    name={selectedIcon as any}
                                    size={24}
                                    color={isLightColor(selectedColor) ? "#000" : "#fff"}
                                />
                            </View>

                            <Text
                                style={{
                                    color: theme.text,
                                    fontSize: 16,
                                    fontWeight: "600",
                                }}
                            >
                                {categoryName || "Category Name"}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* BUTTON */}
                <View style={{
                    alignItems: "center",
                    justifyContent: "center",
                }}>

                    <TPrimaryButton
                        title={isEdit ? "Update Category" : "Create Category"}
                        icon="checkmark"
                        theme={theme}
                        onPress={handleSave}
                        style={{ width: width * 0.8, marginBottom: width * 0.09 }}
                    />
                </View>
                {showColorPicker && (
                    <View style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999,
                        elevation: 20,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>

                        <View style={{
                            width: "90%",
                            height: 480,
                            backgroundColor: theme.card,
                            borderRadius: 20,
                            padding: 16,
                        }}>

                            {/* HEADER */}
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 10,
                            }}>
                                <Text style={{
                                    color: theme.text,
                                    fontSize: 16,
                                    fontWeight: "700",
                                }}>
                                    Pick Color
                                </Text>

                                <TouchableOpacity onPress={() => setShowColorPicker(false)}>
                                    <Ionicons name="close" size={20} color={theme.text} />
                                </TouchableOpacity>
                            </View>

                            {/* PREVIEW */}
                            <View style={{
                                alignItems: "center",
                                marginBottom: 10,
                            }}>
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 22,
                                    backgroundColor: selectedColor,
                                }} />
                                <Text style={{
                                    marginTop: 5,
                                    fontSize: 12,
                                    color: theme.subText,
                                }}>
                                    {selectedColor}
                                </Text>
                            </View>

                            {/* PICKER */}
                            <View style={{ flex: 1 }}>
                                <ColorPicker
                                    color={selectedColor}
                                    onColorChange={(color) => setSelectedColor(color)}
                                    thumbSize={20}
                                    sliderSize={18}
                                    noSnap
                                    row={false}
                                />
                            </View>

                            {/* APPLY BUTTON */}
                            <TouchableOpacity
                                onPress={() => setShowColorPicker(false)}
                                style={{
                                    marginTop: 10,
                                    backgroundColor: theme.primary,
                                    paddingVertical: 12,
                                    borderRadius: 10,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "600" }}>
                                    Apply Color
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                )}
            </TKeyboardWrapper>
        </SafeAreaView >
    );
}