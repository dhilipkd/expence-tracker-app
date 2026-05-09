import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
} from "react-native";

type Props = {
    visible: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    theme: any;
};

export default function TConfirmDialog({
    visible,
    title = "Confirm",
    message = "Are you sure?",
    onConfirm,
    onCancel,
    theme,
}: Props) {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: "80%",
                        backgroundColor: theme.card,
                        padding: 20,
                        borderRadius: 12,

                        shadowColor: "#22C55E",
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        elevation: 12,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: theme.text,
                            marginBottom: 10,
                        }}
                    >
                        {title}
                    </Text>

                    <Text
                        style={{
                            color: theme.subText,
                            marginBottom: 20,
                        }}
                    >
                        {message}
                    </Text>

                    {/* BUTTONS */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                        }}
                    >
                        <TouchableOpacity
                            onPress={onCancel}
                            style={{
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                marginRight: 10,
                            }}
                        >
                            <Text style={{ color: theme.subText }}>
                                No
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            style={{
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                backgroundColor: "#22C55E",
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ color: "#fff" }}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal >
    );
}