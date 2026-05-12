import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    StyleSheet,
    StatusBar,
    Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../../types/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { auth, db } from "../../config/firebase";
import { useTheme } from "../../hooks/ThemeContext";
import TLoader from "../../components/common/TLoader";
import { LinearGradient } from "expo-linear-gradient";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList
>;

/* ─────────────────────────────────────────── */
/* HELPERS                                     */
/* ─────────────────────────────────────────── */

function greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
}

function firstName(displayName: string | null): string {
    if (!displayName) return "there";
    return displayName.split(" ")[0];
}

function fmt(n: number): string {
    return n.toLocaleString("en-IN");
}

function shortFmt(n: number): string {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n}`;
}

function getMonthRange(): { start: Date; end: Date } {
    const now = new Date();
    return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
    };
}

function txDate(item: any): Date {
    return new Date(
        item.date?.seconds ? item.date.seconds * 1000 : item.date
    );
}

function relativeDay(date: Date): string {
    const now = new Date();
    const diff = Math.floor(
        (now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) /
        86400000
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/* ─────────────────────────────────────────── */
/* LAST 7 DAYS INTERACTIVE BAR CHART          */
/* ─────────────────────────────────────────── */

interface Last7DaysProps {
    transactions: any[];
    theme: any;
}

function Last7DaysChart({ transactions, theme }: Last7DaysProps) {
    const animValues = useRef(
        Array.from({ length: 7 }, () => new Animated.Value(0))
    ).current;
    const selectedAnim = useRef(new Animated.Value(0)).current;

    // default selected = today (index 6)
    const [selectedIdx, setSelectedIdx] = useState<number>(6);

    /* ── build buckets ── */
    const buckets = useMemo(() => {
        const today = new Date();
        const result = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            return {
                date: d,
                label: d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 3),
                fullLabel: d.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                }),
                isToday: i === 6,
                total: 0,
                txCount: 0,
            };
        });
        transactions.forEach((t) => {
            if (t.type !== "expense") return;
            const td = txDate(t);
            result.forEach((b) => {
                if (
                    td.getDate() === b.date.getDate() &&
                    td.getMonth() === b.date.getMonth() &&
                    td.getFullYear() === b.date.getFullYear()
                ) {
                    b.total += Number(t.amount || 0);
                    b.txCount += 1;
                }
            });
        });
        return result;
    }, [transactions]);

    const maxVal = useMemo(
        () => Math.max(...buckets.map((b) => b.total), 1),
        [buckets]
    );

    const totalLast7 = useMemo(
        () => buckets.reduce((s, b) => s + b.total, 0),
        [buckets]
    );

    /* ── animate bars on load ── */
    useEffect(() => {
        Animated.parallel(
            buckets.map((b, i) =>
                Animated.timing(animValues[i], {
                    toValue: b.total / maxVal,
                    duration: 700,
                    delay: i * 70,
                    useNativeDriver: false,
                })
            )
        ).start();
    }, [buckets, maxVal]);

    /* ── animate info card on selection ── */
    useEffect(() => {
        selectedAnim.setValue(0);
        Animated.spring(selectedAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 160,
            friction: 10,
        }).start();
    }, [selectedIdx]);

    const BAR_MAX_H = 90;
    const selected = buckets[selectedIdx];

    /* bar color logic */
    const barColor = (i: number) => {
        if (i === selectedIdx) return "#8B5CF6";
        if (buckets[i].isToday) return "#8B5CF680";
        return "#8B5CF630";
    };

    return (
        <View style={styles.chartWrap}>
            {/* ── Header ── */}
            <View style={styles.chartHeaderRow}>
                <View>
                    <Text style={[styles.chartTitle, { color: theme.text }]}>
                        Last 7 Days
                    </Text>
                    <Text style={[styles.chartSubLabel, { color: theme.subText }]}>
                        Tap a bar to see details
                    </Text>
                </View>
                <View style={styles.chartTotalWrap}>
                    <Text style={[styles.chartTotalLabel, { color: theme.subText }]}>
                        Total
                    </Text>
                    <Text style={[styles.chartTotal, { color: theme.text }]}>
                        {shortFmt(totalLast7)}
                    </Text>
                </View>
            </View>

            {/* ── Bars ── */}
            <View style={styles.barsRow}>
                {buckets.map((b, i) => {
                    const isSelected = i === selectedIdx;
                    return (
                        <TouchableOpacity
                            key={i}
                            style={styles.barCol}
                            activeOpacity={0.75}
                            onPress={() => setSelectedIdx(i)}
                        >
                            {/* amount label above bar */}
                            {isSelected && (
                                <Text
                                    style={[
                                        styles.barAmtLabel,
                                        {
                                            color: "#8B5CF6",
                                            fontWeight: "700",
                                        },
                                    ]}
                                >
                                    {shortFmt(b.total)}
                                </Text>
                            )}

                            {/* bar track */}
                            <View
                                style={[
                                    styles.barTrack,
                                    {
                                        height: BAR_MAX_H,
                                        backgroundColor: theme.background,
                                        borderWidth: isSelected ? 1.5 : 0,
                                        borderColor: isSelected ? "#8B5CF650" : "transparent",
                                    },
                                ]}
                            >
                                <Animated.View
                                    style={[
                                        styles.barFill,
                                        {
                                            backgroundColor: barColor(i),
                                            height: animValues[i].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [4, BAR_MAX_H - 4],
                                            }),
                                            // selected bar slightly wider feel via shadow
                                            shadowColor: isSelected ? "#8B5CF6" : "transparent",
                                            shadowOffset: { width: 0, height: 0 },
                                            shadowOpacity: 0.5,
                                            shadowRadius: 6,
                                            elevation: isSelected ? 4 : 0,
                                        },
                                    ]}
                                />
                            </View>

                            {/* day label */}
                            <Text
                                style={[
                                    styles.barLabel,
                                    {
                                        color: isSelected
                                            ? "#8B5CF6"
                                            : b.isToday
                                                ? theme.text
                                                : theme.subText,
                                        fontWeight: isSelected || b.isToday ? "700" : "400",
                                    },
                                ]}
                            >
                                {b.label}
                            </Text>

                            {/* today dot */}
                            {b.isToday && (
                                <View
                                    style={[
                                        styles.todayDot,
                                        {
                                            backgroundColor: isSelected ? "#8B5CF6" : theme.subText,
                                        },
                                    ]}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* ── Selected Day Info Card ── */}
            <Animated.View
                style={[
                    styles.selectedCard,
                    {
                        backgroundColor: theme.background,
                        borderColor: "#8B5CF630",
                        opacity: selectedAnim,
                        transform: [
                            {
                                translateY: selectedAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [6, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.selectedLeft}>
                    {/* colored dot */}
                    <View
                        style={[
                            styles.selectedDot,
                            {
                                backgroundColor:
                                    selected.total > 0 ? "#8B5CF6" : theme.border,
                            },
                        ]}
                    />
                    <View>
                        <Text style={[styles.selectedDay, { color: theme.text }]}>
                            {selected.isToday ? "Today" : selected.fullLabel}
                        </Text>
                        <Text style={[styles.selectedTxCount, { color: theme.subText }]}>
                            {selected.txCount > 0
                                ? `${selected.txCount} transaction${selected.txCount > 1 ? "s" : ""}`
                                : "No transactions"}
                        </Text>
                    </View>
                </View>
                <Text
                    style={[
                        styles.selectedAmt,
                        {
                            color: selected.total > 0 ? "#EF4444" : theme.subText,
                        },
                    ]}
                >
                    {selected.total > 0 ? `- ₹${fmt(selected.total)}` : "₹ 0"}
                </Text>
            </Animated.View>
        </View>
    );
}

/* ─────────────────────────────────────────── */
/* TRANSACTION ROW                            */
/* ─────────────────────────────────────────── */

interface TxRowProps {
    item: any;
    theme: any;
}

function TxRow({ item, theme }: TxRowProps) {
    const isExp = item.type === "expense";
    return (
        <View style={styles.txRow}>
            {/* Icon */}
            <View
                style={[
                    styles.txIcon,
                    { backgroundColor: `${item.categoryColor ?? "#8B5CF6"}18` },
                ]}
            >
                <Ionicons
                    name={(item.categoryIcon ?? "ellipse-outline") as any}
                    size={20}
                    color={item.categoryColor ?? "#8B5CF6"}
                />
            </View>

            {/* Info */}
            <View style={styles.txInfo}>
                <Text
                    style={[styles.txName, { color: theme.text }]}
                    numberOfLines={1}
                >
                    {item.title || item.note || item.categoryName || "Transaction"}
                </Text>
                <Text style={[styles.txSub, { color: theme.subText }]}>
                    {item.categoryName} · {relativeDay(txDate(item))}
                </Text>
            </View>

            {/* Amount */}
            <Text
                style={[
                    styles.txAmt,
                    { color: isExp ? "#EF4444" : "#22C55E" },
                ]}
            >
                {isExp ? "-" : "+"}₹{fmt(Number(item.amount))}
            </Text>
        </View>
    );
}

/* ─────────────────────────────────────────── */
/* MAIN SCREEN                                */
/* ─────────────────────────────────────────── */

interface DashboardScreenProps {
    navigation: any;
}

export default function DashboardScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { theme } = useTheme();
    const { width } = useWindowDimensions();

    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<any[]>([]);

    const user = auth.currentUser;

    /* ── fetch ── */
    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const q = query(
            collection(db, "users", user.uid, "transactions"),
            orderBy("date", "desc")
        );
        const unsub = onSnapshot(q, (snap) => {
            setTransactions(
                snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            );
            setLoading(false);
        });
        return () => unsub();
    }, []);

    /* ── current month filter ── */
    const { start, end } = useMemo(() => getMonthRange(), []);

    const monthTx = useMemo(
        () =>
            transactions.filter((t) => {
                const d = txDate(t);
                return d >= start && d <= end;
            }),
        [transactions, start, end]
    );

    const totalIncome = useMemo(
        () =>
            monthTx
                .filter((t) => t.type === "income")
                .reduce((s, t) => s + Number(t.amount || 0), 0),
        [monthTx]
    );

    const totalExpense = useMemo(
        () =>
            monthTx
                .filter((t) => t.type === "expense")
                .reduce((s, t) => s + Number(t.amount || 0), 0),
        [monthTx]
    );

    const netBalance = totalIncome - totalExpense;

    /* ── recent 5 transactions ── */
    const recentTx = useMemo(() => {
        return [...transactions]
            .sort((a, b) => {
                const aDate = txDate(a).getTime();
                const bDate = txDate(b).getTime();

                return bDate - aDate;
            })
            .slice(0, 5);
    }, [transactions]);

    /* ── greeting emoji ── */
    const hour = new Date().getHours();
    const greetEmoji = hour < 12 ? "☀️" : hour < 17 ? "⛅" : "🌙";

    return (
        <SafeAreaView
            style={[styles.safe, { backgroundColor: theme.background }]}
            edges={["top"]}
        >
            <StatusBar
                barStyle={theme.text === "#fff" || theme.text === "#ffffff" ? "light-content" : "dark-content"}
            />
            <TLoader visible={loading} color="#8B5CF6" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}
            >
                {/* ═══════════════════════════════ */}
                {/* HEADER                         */}
                {/* ═══════════════════════════════ */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greetName, { color: theme.text }]}>
                            Hello {firstName(user?.displayName ?? null)}
                        </Text>
                        <Text style={[styles.greetSub, { color: theme.subText }]}>
                            {greeting()} {greetEmoji}
                        </Text>
                        <Text style={[styles.greetSub, { color: theme.subText }]}>
                            Here's your financial overview
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.notifBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="notifications-outline" size={22} color={theme.text} />
                        {/* red dot */}
                        <View style={styles.notifDot} />
                    </TouchableOpacity>
                </View>

                {/* ═══════════════════════════════ */}
                {/* BALANCE CARD (gradient)        */}
                {/* ═══════════════════════════════ */}
                <LinearGradient
                    colors={["#6366F1", "#8B5CF6", "#A855F7"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.balanceCard}
                >
                    <View style={styles.balanceDecor1} />
                    <View style={styles.balanceDecor2} />

                    <Text style={styles.balanceLbl}>Total Balance</Text>
                    <Text style={styles.balanceAmt}>
                        ₹ {fmt(netBalance)}
                    </Text>

                    <View style={styles.balanceRow}>
                        {/* Income pill */}
                        <View style={styles.balancePill}>
                            <View style={[styles.pillIcon, { backgroundColor: "#22C55E30" }]}>
                                <Ionicons name="trending-up" size={14} color="#22C55E" />
                            </View>
                            <View>
                                <Text style={styles.pillLbl}>Income</Text>
                                <Text style={styles.pillAmt}>{shortFmt(totalIncome)}</Text>
                            </View>
                        </View>

                        {/* divider */}
                        <View style={styles.balanceDivider} />

                        {/* Expense pill */}
                        <View style={styles.balancePill}>
                            <View style={[styles.pillIcon, { backgroundColor: "#EF444430" }]}>
                                <Ionicons name="trending-down" size={14} color="#EF4444" />
                            </View>
                            <View>
                                <Text style={styles.pillLbl}>Expense</Text>
                                <Text style={styles.pillAmt}>{shortFmt(totalExpense)}</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* ═══════════════════════════════ */}
                {/* DONUT + BUDGET ROW            */}
                {/* ═══════════════════════════════ */}
                <View style={styles.midRow}>

                    {/* Last 7 Days card */}
                    <View
                        style={[
                            styles.budgetCard,
                            { backgroundColor: theme.card, borderColor: theme.border },
                        ]}
                    >
                        <Text style={[styles.cardTitle, { color: theme.text }]}>
                            Spending
                        </Text>
                        <Last7DaysChart
                            transactions={transactions}
                            theme={theme}
                        />
                    </View>
                </View>

                {/* ═══════════════════════════════ */}
                {/* QUICK ACTIONS                  */}
                {/* ═══════════════════════════════ */}
                <View style={styles.quickRow}>
                    {[
                        { icon: "add-circle-outline", label: "Add", color: "#8B5CF6", action: () => navigation.navigate("CreateTransaction") },
                        { icon: "bar-chart-outline", label: "Reports", color: "#3B82F6", action: () => navigation.navigate("Reports") },
                        { icon: "albums-outline", label: "History", color: "#F59E0B", action: () => navigation.navigate("Transactions") },
                        { icon: "settings-outline", label: "Settings", color: "#22C55E", action: () => navigation.navigate("Settings") },
                    ].map((q) => (
                        <TouchableOpacity
                            key={q.label}
                            style={[
                                styles.quickBtn,
                                { backgroundColor: theme.card, borderColor: theme.border },
                            ]}
                            activeOpacity={0.75}
                            onPress={q.action}
                        >
                            <View
                                style={[
                                    styles.quickIcon,
                                    { backgroundColor: `${q.color}18` },
                                ]}
                            >
                                <Ionicons name={q.icon as any} size={22} color={q.color} />
                            </View>
                            <Text style={[styles.quickLbl, { color: theme.subText }]}>
                                {q.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ═══════════════════════════════ */}
                {/* RECENT TRANSACTIONS            */}
                {/* ═══════════════════════════════ */}
                <View
                    style={[
                        styles.card,
                        { backgroundColor: theme.card, borderColor: theme.border },
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>
                            Recent Transactions
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Transactions")}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {recentTx.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View
                                style={[
                                    styles.emptyIconBg,
                                    { backgroundColor: theme.background },
                                ]}
                            >
                                <Ionicons
                                    name="receipt-outline"
                                    size={32}
                                    color={theme.subText}
                                />
                            </View>
                            <Text style={[styles.emptyTxt, { color: theme.subText }]}>
                                No transactions yet
                            </Text>
                        </View>
                    ) : (
                        recentTx.map((item, idx) => (
                            <React.Fragment key={item.id}>
                                <TxRow item={item} theme={theme} />
                                {idx < recentTx.length - 1 && (
                                    <View
                                        style={[
                                            styles.divider,
                                            { backgroundColor: theme.border },
                                        ]}
                                    />
                                )}
                            </React.Fragment>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ─────────────────────────────────────────── */
/* STYLES                                     */
/* ─────────────────────────────────────────── */

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },

    scroll: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 140,
    },

    /* ───────────────── HEADER ───────────────── */

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 26,
        marginTop: 10,
    },

    greetSub: {
        fontSize: 13,
        fontWeight: "500",
        marginBottom: 4,
    },

    greetName: {
        fontSize: 26,
        fontWeight: "800",
    },

    notifBtn: {
        width: 48,
        height: 48,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    notifDot: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: "#EF4444",
        borderWidth: 1.5,
        borderColor: "#fff",
    },

    /* ───────────────── BALANCE CARD ───────────────── */

    balanceCard: {
        borderRadius: 25,
        padding: 18,
        marginBottom: 20,
        overflow: "hidden",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 12,
    },

    balanceDecor1: {
        position: "absolute",
        top: -40,
        right: -40,
        width: 170,
        height: 170,
        borderRadius: 100,
        backgroundColor: "rgba(255,255,255,0.06)",
    },

    balanceDecor2: {
        position: "absolute",
        bottom: -20,
        left: 70,
        width: 110,
        height: 110,
        borderRadius: 100,
        backgroundColor: "rgba(255,255,255,0.05)",
    },

    balanceLbl: {
        color: "rgba(255,255,255,0.72)",
        fontSize: 13,
        fontWeight: "500",
    },

    balanceAmt: {
        color: "#fff",
        fontSize: 42,
        fontWeight: "800",
        letterSpacing: -1.2,
    },

    balanceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
        backgroundColor: "rgba(255,255,255,0.10)",
        borderRadius: 18,
        padding: 10,
    },

    balancePill: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    pillIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    pillLbl: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 11,
        fontWeight: "500",
    },

    pillAmt: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },

    balanceDivider: {
        width: 1,
        height: 40,
        backgroundColor: "rgba(255,255,255,0.20)",
        marginHorizontal: 12,
    },

    /* ───────────────── MID ROW ───────────────── */

    midRow: {
        flexDirection: "column",
        gap: 16,
        marginBottom: 18,
    },

    /* ───────────────── CHART CARD ───────────────── */

    budgetCard: {
        width: "100%",
        borderRadius: 24,
        borderWidth: 1,
        padding: 20,
        gap: 14,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },

    chartWrap: {
        gap: 14,
    },

    chartHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    chartTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 3,
    },

    chartSubLabel: {
        fontSize: 11,
    },

    chartTotalWrap: {
        alignItems: "flex-end",
    },

    chartTotalLabel: {
        fontSize: 11,
    },

    chartTotal: {
        fontSize: 16,
        fontWeight: "800",
    },

    barsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: 6,
    },

    barCol: {
        flex: 1,
        alignItems: "center",
        gap: 5,
    },

    barAmtLabel: {
        fontSize: 9,
        fontWeight: "700",
    },

    barTrack: {
        width: 26,
        borderRadius: 10,
        justifyContent: "flex-end",
        overflow: "hidden",
    },

    barFill: {
        width: "100%",
        borderRadius: 10,
    },

    barLabel: {
        fontSize: 10,
        marginTop: 4,
    },

    todayDot: {
        width: 4,
        height: 4,
        borderRadius: 10,
    },

    selectedCard: {
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
    },

    selectedLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },

    selectedDot: {
        width: 10,
        height: 10,
        borderRadius: 10,
    },

    selectedDay: {
        fontSize: 13,
        fontWeight: "700",
    },

    selectedTxCount: {
        fontSize: 11,
        marginTop: 2,
    },

    selectedAmt: {
        fontSize: 15,
        fontWeight: "800",
    },

    /* ───────────────── QUICK ACTIONS ───────────────── */

    quickRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 18,
    },

    quickBtn: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 1,
        paddingVertical: 16,
        alignItems: "center",
        gap: 8,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },

    quickIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    quickLbl: {
        fontSize: 12,
        fontWeight: "600",
    },

    /* ───────────────── CARD ───────────────── */

    card: {
        borderRadius: 28,
        borderWidth: 1,
        padding: 20,
        marginBottom: 24,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },

    seeAll: {
        fontSize: 13,
        fontWeight: "700",
        color: "#8B5CF6",
    },

    /* ───────────────── TRANSACTION ROW ───────────────── */

    txRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
    },

    txIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    txInfo: {
        flex: 1,
    },

    txName: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 4,
    },

    txSub: {
        fontSize: 12,
    },

    txAmt: {
        fontSize: 15,
        fontWeight: "800",
    },

    divider: {
        height: 1,
        marginVertical: 2,
        opacity: 0.4,
    },

    /* ───────────────── EMPTY ───────────────── */

    emptyState: {
        paddingVertical: 36,
        alignItems: "center",
        gap: 12,
    },

    emptyIconBg: {
        width: 68,
        height: 68,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyTxt: {
        fontSize: 14,
    },

    /* ───────────────── BOTTOM ACTION BAR ───────────────── */

    quickActionsBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        borderTopWidth: 1,
        paddingBottom: 30,
        paddingTop: 14,
        paddingHorizontal: 18,
        gap: 14,

        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    qaBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 14,
        borderRadius: 18,
    },

    qaIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    qaLabel: {
        fontSize: 14,
        fontWeight: "700",
    },

    qaDivider: {
        width: 1,
        height: 42,
        alignSelf: "center",
    },
});
