import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

type Option = {
    label: string;
    value: string;
};

type Props = {
    label: string;
    value: string;
    options: Option[];
    onChange: (val: string) => void;
    theme: any;
    style?: any;
};

export default function TModalDropdown({
    label,
    value,
    options,
    onChange,
    theme,
    style,
}: Props) {

    const [visible, setVisible] = useState(false);

    const selectedLabel =
        options.find((o) => o.value === value)?.label || "Select";

    return (
        <View style={style}>

            {/* LABEL */}
            <Text
                style={{
                    marginBottom: 10,
                    color: theme.text,
                    fontWeight: "600",
                }}
            >
                {label}
            </Text>

            {/* INPUT BOX */}
            <TouchableOpacity
                onPress={() => setVisible(true)}
                activeOpacity={0.8}
                style={{
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: 10,
                    padding: 14,
                    backgroundColor: theme.input,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: theme.text }}>
                    {selectedLabel}
                </Text>

                <Ionicons
                    name="chevron-down"
                    size={18}
                    color={theme.text}
                />
            </TouchableOpacity>

            {/* MODAL */}
            <Modal
                visible={visible}
                animationType="slide"
                transparent
            >
                {/* BACKDROP */}
                <Pressable
                    onPress={() => setVisible(false)}
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "flex-end",
                    }}
                >

                    {/* SHEET */}
                    <View
                        style={{
                            backgroundColor: theme.card,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 16,
                            maxHeight: "60%",
                        }}
                    >
                        {/* HEADER */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: theme.text,
                                }}
                            >
                                Select {label}
                            </Text>

                            <TouchableOpacity
                                onPress={() => setVisible(false)}
                            >
                                <Ionicons
                                    name="close"
                                    size={22}
                                    color={theme.text}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* OPTIONS */}
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onChange(item.value);
                                        setVisible(false);
                                    }}
                                    style={{
                                        paddingVertical: 14,
                                        borderBottomWidth: 0.5,
                                        borderColor: theme.border,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text style={{ color: theme.text }}>
                                        {item.label}
                                    </Text>

                                    {value === item.value && (
                                        <Ionicons
                                            name="checkmark"
                                            size={18}
                                            color={theme.primary}
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>

        </View>
    );
}