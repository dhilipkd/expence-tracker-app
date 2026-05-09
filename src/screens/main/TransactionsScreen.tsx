import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    useWindowDimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../../types/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../hooks/ThemeContext";
import { useTransactions } from "../../hooks/useTransactions";

import CustomToggle from "../../components/common/TToggleButton";
import TLoader from "../../components/common/TLoader";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList
>;

export default function TransactionScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { theme } = useTheme();
    const { width } = useWindowDimensions();

    const [filter, setFilter] = useState<
        "all" | "income" | "expense"
    >("all");

    const [search, setSearch] = useState("");
    const [focused, setFocused] = useState(false);

    const {
        transactions,
        loading,
    } = useTransactions();

    /* ---------------- FILTERED DATA ---------------- */

    const filteredTransactions = useMemo(() => {

        let data = [...transactions];

        if (filter !== "all") {
            data = data.filter(
                (item) => item.type === filter
            );
        }

        if (search.trim()) {
            data = data.filter((item) =>
                item.title
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }
        return data;
    }, [transactions, filter, search]);

    /* ---------------- MONTH FORMAT ---------------- */

    const formatMonth = (date: any) => {
        const d = new Date(
            date?.seconds
                ? date.seconds * 1000
                : date
        );

        return d.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    /* ---------------- DATE FORMAT ---------------- */
    const formatDate = (date: any) => {
        const d = new Date(
            date?.seconds
                ? date.seconds * 1000
                : date
        );

        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    /* ---------------- GROUP DATA ---------------- */
    const groupedData = useMemo(() => {
        const groups: any = {};
        filteredTransactions.forEach((item) => {
            const key = formatMonth(item.date);
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });
        return Object.entries(groups);
    }, [filteredTransactions]);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background,
            }}
        >
            <TLoader
                visible={loading}
                color={theme.primary}
            />
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 18,
                    paddingTop: 15,
                }}
            >
                {/* HEADER */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 20,
                    }}
                >
                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 24,
                            fontWeight: "700",
                        }}
                    >
                        Transactions
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* SEARCH */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: theme.card,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: focused ? theme.primary : theme.border,
                        paddingHorizontal: 14,
                        height: 52,
                        marginBottom: 16,
                    }}
                >
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color={theme.subText}
                    />

                    <TextInput
                        placeholder="Search transactions"
                        placeholderTextColor={theme.subText}
                        value={search}
                        onChangeText={setSearch}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        autoCapitalize="none"
                        style={{
                            flex: 1,
                            marginLeft: 10,
                            color: theme.text,
                            fontSize: 15,
                            paddingVertical: 0,
                        }}
                    />
                </View>

                {/* FILTER */}
                <View
                    style={{
                        marginBottom: 20,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            width: width * 0.8,
                        }}
                    >
                        <CustomToggle
                            options={[
                                {
                                    label: "All",
                                    value: "all",
                                },
                                {
                                    label: "Expense",
                                    value: "expense",
                                },
                                {
                                    label: "Income",
                                    value: "income",
                                },
                            ]}
                            value={filter}
                            onChange={(val) => setFilter(val as any)}
                            theme={theme}
                        />
                    </View>
                </View>

                {/* LIST */}

                <FlatList
                    data={groupedData}
                    keyExtractor={(item) => item[0]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 120,
                    }}
                    renderItem={({ item }) => {

                        const month = item[0];
                        const transactions = item[1] as any[];

                        return (
                            <View
                                style={{
                                    marginBottom: 24,
                                }}
                            >

                                {/* MONTH */}

                                <Text
                                    style={{
                                        color: theme.subText,
                                        fontSize: 14,
                                        fontWeight: "600",
                                        marginBottom: 14,
                                    }}
                                >
                                    {month}
                                </Text>

                                {/* ITEMS */}
                                {transactions.map((transaction) => {
                                    const isIncome =
                                        transaction.type === "income";
                                    return (
                                        <TouchableOpacity
                                            key={transaction.id}
                                            activeOpacity={0.9}
                                            onPress={() =>
                                                navigation.navigate(
                                                    "TransactionDetails",
                                                    {
                                                        transaction,
                                                    }
                                                )
                                            }
                                            style={{
                                                backgroundColor: theme.card,
                                                borderRadius: 18,
                                                padding: 16,
                                                marginBottom: 14,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                borderWidth: 1,
                                                borderColor: theme.border,
                                                shadowColor: "#000",
                                                shadowOpacity: 0.05,
                                                shadowRadius: 10,
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 3,
                                                },
                                                elevation: 3,
                                            }}
                                        >
                                            {/* LEFT */}
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    flex: 1,
                                                }}
                                            >
                                                {/* ICON */}
                                                <View
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: 25,
                                                        backgroundColor:
                                                            `${transaction.categoryColor}20`,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginRight: 14,
                                                    }}
                                                >
                                                    <Ionicons
                                                        name={
                                                            transaction.categoryIcon ||
                                                            "wallet-outline"
                                                        }
                                                        size={22}
                                                        color={
                                                            transaction.categoryColor
                                                        }
                                                    />
                                                </View>
                                                {/* INFO */}
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            color: theme.text,
                                                            fontSize: 16,
                                                            fontWeight: "700",
                                                        }}
                                                    >
                                                        {transaction.title}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            marginTop: 4,
                                                            color: theme.subText,
                                                            fontSize: 13,
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {
                                                            transaction.categoryName
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                            {/* RIGHT */}
                                            <View
                                                style={{
                                                    alignItems: "flex-end",
                                                    marginLeft: 10,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: "700",
                                                        color: isIncome
                                                            ? "#22C55E"
                                                            : "#EF4444",
                                                    }}
                                                >
                                                    {isIncome ? "+" : "-"} ₹
                                                    {Number(
                                                        transaction.amount
                                                    ).toLocaleString()}
                                                </Text>
                                                <Text
                                                    style={{
                                                        marginTop: 4,
                                                        color: theme.subText,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {formatDate(
                                                        transaction.date
                                                    )}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        );
                    }}
                    ListEmptyComponent={() => (
                        <View
                            style={{
                                marginTop: 120,
                                alignItems: "center",
                            }}
                        >
                            <Ionicons
                                name="receipt-outline"
                                size={70}
                                color={theme.subText}
                            />
                            <Text
                                style={{
                                    marginTop: 16,
                                    color: theme.subText,
                                    fontSize: 15,
                                }}
                            >
                                No Transactions Found
                            </Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}
