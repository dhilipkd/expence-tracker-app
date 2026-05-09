import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    useWindowDimensions,
    Platform,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from '../../types/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../hooks/ThemeContext";
import { auth } from "../../config/firebase";
import { subscribeCategories } from "../../services/categoryService";
import { createTransaction } from "../../services/transactionService";

import TPrimaryButton from "../../components/common/TPrimaryButton";
import TCustomInputField from "../../components/common/TCustomInputField";
import CustomToggle from "../../components/common/TToggleButton";
import TKeyboardWrapper from "../../components/common/TKeyboardWrapper";
import TLoader from "../../components/common/TLoader";
import TDropdown from "../../components/common/TDropdown";
import TRadioButton from "../../components/common/TRadioButton";

import { Transaction } from "../../types/transaction.types";
import { uploadFileToStorage } from "../../services/storageService";
import { updateTransaction } from "../../services/transactionService";

import * as DocumentPicker from "expo-document-picker";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList
>;


export default function CreateTransactionScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { theme } = useTheme();
    const { width } = useWindowDimensions();

    const route = useRoute<any>();

    const editData = route?.params?.editData;
    const isEdit = !!editData;

    const [title, setTitle] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card" | "bank">("cash");
    const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending">("paid");

    const [type, setType] = useState<"expense" | "income">("expense");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [file, setFile] = useState<any>(null);

    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

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

    const resetForm = () => {
        setTitle("");
        setAmount("");
        setNote("");
        setSelectedCategory(null);
        setDate(new Date());
        setPaymentMethod("cash");
        setPaymentStatus("paid");
        setFile(null);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        resetForm();
        setTimeout(() => setRefreshing(false), 800);
    };

    /* ---------------- FETCH CATEGORIES ---------------- */
    useEffect(() => {

        if (editData) {

            setTitle(editData.title);

            setAmount(
                String(editData.amount)
            );

            setType(editData.type);

            setNote(
                editData.note || ""
            );

            setDate(
                editData.date?.seconds
                    ? new Date(
                        editData.date.seconds * 1000
                    )
                    : new Date(editData.date)
            );

            setPaymentMethod(
                editData.paymentMethod
            );

            setPaymentStatus(
                editData.paymentStatus
            );

            setSelectedCategory({
                id: editData.categoryId,
                title: editData.categoryName,
                icon: editData.categoryIcon,
                color: editData.categoryColor,
            });

            if (editData.attachment) {
                setFile(editData.attachment);
            }
        }

    }, [editData]);

    useEffect(() => {

        const unsubscribe = subscribeCategories((data) => {
            setCategories(data.filter((c) => c.type === type));
            setSelectedCategory(null);
        });

        return () => unsubscribe?.();

    }, [type]);

    /* ---------------- SAVE ---------------- */
    const handleSave = async () => {
        if (
            !title.trim() ||
            !amount ||
            Number(amount) <= 0 ||
            !selectedCategory
        ) {
            Alert.alert(
                "Invalid Data",
                "Enter valid title, amount & category"
            );
            return;
        }

        try {
            setLoading(true);
            let uploadedFile =
                editData?.attachment;
            if (file?.uri) {

                uploadedFile =
                    await uploadFileToStorage(
                        file,
                        auth.currentUser?.uid || ""
                    );
            }
            const payload: Transaction = {
                userId:
                    auth.currentUser?.uid || "",
                title,
                type,
                amount:
                    parseFloat(amount),
                categoryId:
                    selectedCategory.id,
                categoryName:
                    selectedCategory.title,
                categoryIcon:
                    selectedCategory.icon,
                categoryColor:
                    selectedCategory.color,
                note,
                date,
                paymentMethod,
                paymentStatus:
                    type === "income"
                        ? "paid"
                        : paymentStatus,
                ...(uploadedFile && {
                    attachment: uploadedFile,
                }),
            };

            let success = false;
            if (isEdit) {
                success =
                    await updateTransaction(
                        editData.id,
                        payload
                    );
            } else {
                success =
                    await createTransaction(
                        payload
                    );
            }

            if (success) {
                resetForm();
                navigation.navigate("Transactions");
            } else {
                Alert.alert(
                    "Error",
                    isEdit
                        ? "Update failed"
                        : "Save failed"
                );
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const isImage = file?.type?.startsWith("image");

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    "image/*",
                    "application/pdf",
                ],
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled) {
                const fileObj = result.assets[0];

                setFile({
                    uri: fileObj.uri,
                    name: fileObj.name,
                    size: fileObj.size,
                    type: fileObj.mimeType,
                });
            }
        } catch (err) {
            Alert.alert("Error", "File selection failed");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <TKeyboardWrapper
                backgroundColor={theme.background}
                paddingHorizontal={20}
                refreshing={refreshing}
                onRefresh={onRefresh}
                style={{ paddingTop: 15 }}
            >
                <TLoader visible={loading} color={theme.primary} />

                {/* HEADER */}
                <View style={{ flex: 1 }}>

                    {/* HEADER */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 30,
                        }}
                    >
                        <Text
                            style={{
                                color: theme.text,
                                fontSize: 24,
                                fontWeight: "700",
                            }}
                        >
                            {isEdit
                                ? "Update Transaction"
                                : "Add Transaction"}
                        </Text>

                        <View style={{ width: 24 }} />
                    </View>


                    <CustomToggle
                        options={toggleOptions}
                        value={type}
                        onChange={handleTypeChange}
                        theme={theme}
                    />

                    <View style={{ marginTop: 10 }}>
                        <TCustomInputField
                            label="Title"
                            placeholder="Eg: Lunch,Petrol"
                            value={title}
                            onChangeText={setTitle}
                            theme={theme}
                            keyboardType="default"
                            autoCapitalize="sentences"
                            focused={focused === "title"}
                            onFocus={() => setFocused("title")}
                            onBlur={() => setFocused(null)}
                        />
                    </View>

                    {/* AMOUNT */}
                    <View style={{ marginTop: 10 }}>
                        <TCustomInputField
                            label="Amount"
                            placeholder="₹ 0.00"
                            value={amount}
                            onChangeText={setAmount}
                            theme={theme}
                            keyboardType="numeric"
                            focused={focused === "amount"}
                            onFocus={() => setFocused("amount")}
                            onBlur={() => setFocused(null)}
                        />
                    </View>

                    {/* CATEGORY */}
                    <Text style={{
                        marginTop: 20,
                        marginBottom: 10,
                        color: theme.text,
                        fontWeight: "600",
                    }}>
                        Category
                    </Text>

                    <FlatList
                        horizontal
                        data={categories}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => setSelectedCategory(item)}
                                style={{
                                    alignItems: "center",
                                    marginRight: 16,
                                }}
                            >
                                <View style={{
                                    width: 60,
                                    height: 60,
                                    borderColor: theme.border,
                                    borderWidth: 1,
                                    borderRadius: 30,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor:
                                        selectedCategory?.id === item.id
                                            ? "#9ca3af"
                                            : theme.card,
                                }}>
                                    <Ionicons
                                        name={item.icon}
                                        size={22}
                                        color={
                                            selectedCategory?.id === item.id
                                                ? "#fff"
                                                : item.color
                                        }
                                    />
                                </View>

                                <Text style={{
                                    marginTop: 6,
                                    fontSize: 12,
                                    color: theme.text,
                                }}>
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />

                    {/* DATE PICKER FIELD */}
                    <Text
                        style={{
                            marginTop: 30,
                            marginBottom: 10,
                            color: theme.text,
                            fontWeight: "600",
                        }}
                    >
                        Date
                    </Text>

                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                        style={{ marginBottom: 30 }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingHorizontal: 15,
                                paddingVertical: 18,
                                borderRadius: 12,
                                backgroundColor: theme.input,
                                borderWidth: 1,
                                borderColor: theme.border ?? "#ddd",
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.text,
                                    fontSize: 14,
                                }}
                            >
                                {date ? date.toDateString() : "Select Date"}
                            </Text>

                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color={theme.primary}
                            />
                        </View>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDate(selectedDate);
                            }}
                        />
                    )}

                    <TDropdown
                        label="Payment Method"
                        value={paymentMethod}
                        options={[
                            { label: "Cash", value: "cash" },
                            { label: "UPI", value: "upi" },
                            { label: "Card", value: "card" },
                            { label: "Bank", value: "bank" },
                        ]}
                        onChange={(val) => setPaymentMethod(val as any)}
                        theme={theme}
                        style={{ marginBottom: 30 }}
                    />
                    {type === "expense" && (
                        <TRadioButton
                            label="Payment Status"
                            value={paymentStatus}
                            options={[
                                { label: "Paid", value: "paid" },
                                { label: "Pending", value: "pending" },
                            ]}
                            onChange={(val) => setPaymentStatus(val as any)}
                            theme={theme}
                            style={{ marginBottom: 20 }}
                        />
                    )}

                    <Text
                        style={{
                            marginBottom: 10,
                            color: theme.text,
                            fontWeight: "600",
                        }}
                    >
                        Receipt / Attachment
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: theme.subText,
                            marginBottom: 8,
                        }}
                    >
                        Optional – Add receipt or document if available
                    </Text>

                    <TouchableOpacity
                        onPress={pickFile}
                        activeOpacity={0.9}
                        style={{
                            borderWidth: 1,
                            borderStyle: "dashed",
                            borderColor: theme.primary,
                            borderRadius: 14,
                            padding: 18,
                            backgroundColor: theme.card,
                            alignItems: "center",
                        }}
                    >
                        <Ionicons
                            name="cloud-upload-outline"
                            size={28}
                            color={theme.primary}
                        />

                        <Text
                            style={{
                                marginTop: 8,
                                color: theme.text,
                                fontWeight: "600",
                            }}
                        >
                            Upload receipt, invoice or document
                        </Text>

                        <Text
                            style={{
                                marginTop: 4,
                                fontSize: 12,
                                color: theme.subText,
                            }}
                        >
                            JPG, PNG or PDF up to 10MB
                        </Text>
                    </TouchableOpacity>

                    {file && (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 12,
                                padding: 12,
                                borderRadius: 12,
                                backgroundColor: theme.card,
                                borderWidth: 1,
                                borderColor: theme.border ?? "#ddd",
                            }}
                        >
                            <Ionicons
                                name={
                                    isImage
                                        ? "image-outline"
                                        : "document-text-outline"
                                }
                                size={24}
                                color={theme.primary}
                            />

                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: theme.text,
                                        fontWeight: "600",
                                    }}
                                >
                                    {file.name}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: theme.subText,
                                    }}
                                >
                                    {isImage ? "Image attached" : "Document attached"}
                                </Text>
                            </View>

                            <TouchableOpacity onPress={() => setFile(null)}>
                                <Ionicons name="close-circle" size={22} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* NOTE */}
                    <View style={{ marginTop: 30 }}>
                        <TCustomInputField
                            label="Note"
                            placeholder="Add note (optional)"
                            value={note}
                            onChangeText={setNote}
                            theme={theme}
                            autoCapitalize="sentences"
                            focused={focused === "note"}
                            onFocus={() => setFocused("note")}
                            onBlur={() => setFocused(null)}
                            style={{
                                height: 120,
                                textAlignVertical: "top",
                            } as any}
                        />
                    </View>
                </View>

                {/* SAVE BUTTON */}
                <View style={{
                    marginTop: 10,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <TPrimaryButton
                        title={
                            loading
                                ? isEdit
                                    ? "Updating..."
                                    : "Saving..."
                                : isEdit
                                    ? "Update Transaction"
                                    : "Save Transaction"
                        }
                        theme={theme}
                        icon="checkmark"
                        onPress={handleSave}
                        style={{ width: width * 0.8, marginBottom: width * 0.25 }}
                    />
                </View>
            </TKeyboardWrapper>
        </SafeAreaView>
    );
}