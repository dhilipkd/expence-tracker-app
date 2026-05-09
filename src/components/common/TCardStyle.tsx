import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

type Props = {
    title: string;
    icon?: any;
    color?: string;
    theme: any;

    onPress?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;

    showArrow?: boolean;
    rightIcon?: any;
    textColor?: string;
    style?: any;
};

export default function Card({
    title,
    icon,
    color,
    theme,
    onPress,
    onDelete,
    onEdit,
    showArrow = true,
    rightIcon = "chevron-forward",
    textColor,
    style,
}: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={[{
                backgroundColor: theme.card,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: theme.border,

                padding: 14,
                marginBottom: 14,

                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",

                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 10,
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                elevation: 4,
            }, style]}
        >
            {/* LEFT */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                }}
            >
                <View
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: 22,
                        backgroundColor: color,

                        justifyContent: "center",
                        alignItems: "center",

                        marginRight: 14,
                    }}
                >
                    <Ionicons
                        name={icon}
                        size={20}
                        color={theme.text}
                    />
                </View>

                <Text
                    numberOfLines={1}
                    style={{
                        color: textColor || theme.text,
                        fontSize: 16,
                        fontWeight: "600",
                        flex: 1,
                    }}
                >
                    {title}
                </Text>
            </View>

            {/* RIGHT */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {onEdit && (
                    <TouchableOpacity
                        onPress={onEdit}
                        style={{ marginRight: 12 }}
                    >
                        <Ionicons
                            name="create-outline"
                            size={20}
                            color={theme.primary}
                        />
                    </TouchableOpacity>
                )}

                {/* DELETE */}
                {onDelete && (
                    <TouchableOpacity
                        onPress={onDelete}
                        style={{
                            marginRight: 12,
                        }}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#EF4444"
                        />
                    </TouchableOpacity>
                )}

                {showArrow && (
                    <Ionicons
                        name={rightIcon}
                        size={20}
                        color={theme.subText}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}