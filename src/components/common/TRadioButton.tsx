import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";

type Option = {
    label: string;
    value: string;
};

type Props = {
    label?: string;
    value: string;
    options: Option[];
    onChange: (val: string) => void;
    theme: any;
    style?: any;
};

export default function TRadioButton({
    label,
    value,
    options,
    onChange,
    theme,
    style,
}: Props) {

    return (
        <View style={style}>

            {/* LABEL */}
            {label && (
                <Text
                    style={{
                        marginBottom: 10,
                        color: theme.text,
                        fontWeight: "600",
                    }}
                >
                    {label}
                </Text>
            )}
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    paddingHorizontal: 10,
                    gap: 20,
                }}
            >
                {/* OPTIONS */}
                {options.map((item) => {

                    const selected = value === item.value;

                    return (
                        <TouchableOpacity
                            key={item.value}
                            onPress={() => onChange(item.value)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 12,
                            }}
                        >
                            {/* OUTER CIRCLE */}
                            <View
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    backgroundColor: theme.input,
                                    borderColor: selected
                                        ? theme.primary
                                        : theme.subText,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 10,
                                }}
                            >
                                {/* INNER DOT */}
                                {selected && (
                                    <View
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: theme.primary,
                                        }}
                                    />
                                )}
                            </View>

                            <Text
                                style={{
                                    color: theme.text,
                                    fontSize: 14,
                                }}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}