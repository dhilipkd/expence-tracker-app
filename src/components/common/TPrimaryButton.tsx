import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import {
    TouchableOpacity,
    Text,
    ViewStyle,
} from 'react-native';

type buttonProps = {
    title: string;
    onPress?: () => void;
    theme: any;
    style?: ViewStyle;
    icon?: any;
    iconPosition?: "left" | "right";
};

export default function TPrimaryButton({
    title,
    onPress,
    theme,
    style,
    icon,
    iconPosition = "left",
}: buttonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[{
                flexDirection: "row",
                backgroundColor: theme.primary,
                paddingVertical: 16,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: 'center',
                marginTop: 10,

                shadowColor: "#22C55E",
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                elevation: 8,
            }, style]}
        >
            {icon && iconPosition === "left" && (
                <Ionicons
                    name={icon}
                    size={22}
                    style={{ marginRight: 8, color: "#fff" }}
                />
            )}
            <Text
                style={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: 16,
                }}
            >
                {title}
            </Text>
            {icon && iconPosition === "right" && (
                <Ionicons
                    name={icon}
                    size={22}
                    style={{ marginLeft: 8, color: "#fff" }}
                />
            )}
        </TouchableOpacity>
    );
}