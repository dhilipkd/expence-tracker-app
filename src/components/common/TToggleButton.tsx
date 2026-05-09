import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type Option = {
    label: string;
    value: string;
};

type Props = {
    options: Option[];
    value: string;
    onChange: (val: string) => void;
    theme: any;
};

export default function CustomToggle({
    options,
    value,
    onChange,
    theme,
}: Props) {
    return (
        <View
            style={{
                flexDirection: "row",
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 6,
                marginBottom: 15,
            }}
        >
            {options.map((item) => {
                const active = value === item.value;

                return (
                    <TouchableOpacity
                        key={item.value}
                        onPress={() => onChange(item.value)}
                        style={{
                            flex: 1,
                            paddingVertical: 10,
                            borderRadius: 10,
                            backgroundColor: active
                                ? "#7d7d7e"
                                : "transparent",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: active ? "#fff" : theme.text,
                                fontWeight: "600",
                            }}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}