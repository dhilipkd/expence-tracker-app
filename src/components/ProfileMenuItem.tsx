import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import ProfileSettingsStyles from "../styles/ProfileSettingsScreenStyles";

type Props = {
    icon: any;
    title: string;
    value?: string;
    hideBorder?: boolean;
    theme: any;
    textColor?: string;
    onPress?: () => void;
    showArrow?: boolean;
    containerStyle?: any;
};

export default function ProfileMenuItem({
    icon,
    title,
    value,
    hideBorder,
    theme,
    textColor,
    onPress,
    showArrow,
    containerStyle,
}: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                ProfileSettingsStyles.menuRow,
                {
                    borderBottomWidth: hideBorder ? 0 : 1,
                    borderBottomColor: theme.border,
                }, containerStyle
            ]}
        >
            <View style={ProfileSettingsStyles.menuLeft}>
                <Ionicons
                    name={icon}
                    size={20}
                    color={theme.text}
                />

                <Text
                    style={{
                        color: textColor || theme.text,
                        fontSize: 16,
                        fontWeight: "500",
                    }}
                >
                    {title}
                </Text>
            </View>

            <View style={ProfileSettingsStyles.menuRight}>
                {value && (
                    <Text
                        style={{
                            color: theme.subText,
                            marginRight: 8,
                        }}
                    >
                        {value}
                    </Text>
                )}
                {showArrow !== false && (
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={theme.subText}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}