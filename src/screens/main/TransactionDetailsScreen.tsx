import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/ThemeContext";
import TConfirmDialog from "../../components/common/TConfirmDialog";
import {
    deleteTransaction,
} from "../../services/transactionService";
export default function TransactionDetailsScreen({
    route,
    navigation,
}: any) {
    const { transaction } = route.params;
    const { theme } = useTheme();

    const [confirmVisible, setConfirmVisible] =
        useState(false);

    const isIncome =
        transaction.type === "income";

    const formatDate = (date: any) => {
        const d = new Date(
            date?.seconds
                ? date.seconds * 1000
                : date
        );
        return d.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    const formatTime = (date: any) => {
        const d = new Date(
            date?.seconds
                ? date.seconds * 1000
                : date
        );
        return d.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const handleDelete = async () => {
        setConfirmVisible(false);
        const success =
            await deleteTransaction(
                transaction.id
            );
        if (success) {
            Alert.alert(
                "Deleted",
                "Transaction deleted"
            );
            navigation.goBack();
        } else {
            Alert.alert(
                "Error",
                "Delete failed"
            );
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor:
                    theme.background,

                paddingHorizontal: 20,
                paddingTop: 15,
            }}
        >

            {/* HEADER */}
            <TouchableOpacity
                onPress={() =>
                    navigation.goBack()
                }
                style={{
                    marginBottom: 30,
                }}
            >
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color={theme.text}
                />
            </TouchableOpacity>

            {/* ICON */}
            <View
                style={{
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: 90,
                        height: 90,
                        borderRadius: 45,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                            transaction.categoryColor,
                    }}
                >
                    <Ionicons
                        name={
                            transaction.categoryIcon
                        }
                        size={40}
                        color="#fff"
                    />
                </View>
                <Text
                    style={{
                        marginTop: 16,
                        fontSize: 26,
                        fontWeight: "700",
                        color: theme.text,
                    }}
                >
                    {transaction.title}
                </Text>
                <Text
                    style={{
                        marginTop: 4,
                        color: theme.subText,
                    }}
                >
                    {transaction.categoryName}
                </Text>
                <Text
                    style={{
                        marginTop: 20,
                        fontSize: 34,
                        fontWeight: "700",
                        color: isIncome
                            ? "#22C55E"
                            : "#ff0000",
                    }}
                >
                    {isIncome ? "+" : "-"} ₹
                    {Number(
                        transaction.amount
                    ).toFixed(2)}
                </Text>
            </View>

            {/* DETAILS */}
            <View
                style={{
                    marginTop: 40,
                    borderTopWidth: 1,
                    borderColor: theme.border,
                }}
            >

                <DetailRow
                    label="Date"
                    value={formatDate(
                        transaction.date
                    )}
                    theme={theme}
                />

                <DetailRow
                    label="Time"
                    value={formatTime(
                        transaction.date
                    )}
                    theme={theme}
                />

                <DetailRow
                    label="Payment Method"
                    value={
                        transaction.paymentMethod
                            ?.toUpperCase()
                    }
                    theme={theme}
                />

                <DetailRow
                    label="Status"
                    value={
                        transaction.paymentStatus
                    }
                    theme={theme}
                />

                <DetailRow
                    label="Note"
                    value={
                        transaction.note ||
                        "-"
                    }
                    theme={theme}
                />
            </View>

            {/* ATTACHMENT */}
            {transaction.attachment && (
                <TouchableOpacity
                    onPress={() =>
                        Linking.openURL(
                            transaction.attachment
                                .url
                        )
                    }
                    style={{
                        marginTop: 25,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor:
                            theme.card,
                        borderRadius: 14,
                        padding: 14,
                        borderWidth: 1,
                        borderColor:
                            theme.border,
                    }}
                >
                    <Ionicons
                        name="document-outline"
                        size={22}
                        color={theme.primary}
                    />

                    <Text
                        numberOfLines={1}
                        style={{
                            flex: 1,
                            marginLeft: 10,
                            color: theme.text,
                        }}
                    >
                        {
                            transaction
                                .attachment.name
                        }
                    </Text>
                </TouchableOpacity>
            )}

            {/* BUTTONS */}
            <View
                style={{
                    marginTop: "auto",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 30,
                }}
            >
                {/* EDIT */}
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate(
                            "CreateTransaction",
                            {
                                editData:
                                    transaction,
                            }
                        )
                    }
                    style={{
                        flex: 1,
                        height: 54,
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: theme.border,
                        backgroundColor: theme.primary,
                        marginRight: 10,
                    }}
                >
                    <Text
                        style={{
                            color: theme.text,
                            fontWeight: "700",
                        }}
                    >
                        Edit
                    </Text>
                </TouchableOpacity>

                {/* DELETE */}
                <TouchableOpacity
                    onPress={() =>
                        setConfirmVisible(
                            true
                        )
                    }
                    style={{
                        flex: 1,
                        height: 54,
                        borderRadius: 12,
                        justifyContent:
                            "center",
                        alignItems: "center",
                        borderColor: "#ef4444",
                        borderWidth: 1,
                    }}
                >
                    <Text
                        style={{
                            color: "#ef4444",
                            fontWeight: "700",
                        }}
                    >
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>

            <TConfirmDialog
                visible={confirmVisible}
                title="Delete Transaction"
                message="Are you sure want to delete this transaction?"
                onCancel={() =>
                    setConfirmVisible(
                        false
                    )
                }
                onConfirm={handleDelete}
                theme={theme}
            />
        </SafeAreaView>
    );
}

function DetailRow({
    label,
    value,
    theme,
}: any) {
    return (
        <View
            style={{
                flexDirection: "row",

                justifyContent:
                    "space-between",

                paddingVertical: 18,

                borderBottomWidth: 1,
                borderColor: theme.border,
            }}
        >
            <Text
                style={{
                    color: theme.subText,
                }}
            >
                {label}
            </Text>

            <Text
                style={{
                    color: theme.text,
                    fontWeight: "600",
                    maxWidth: "60%",
                    textAlign: "right",
                }}
            >
                {value}
            </Text>
        </View>
    );
}