import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Modal,
  Animated,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useTheme } from "../../hooks/ThemeContext";
import AnimatedAreaChart from "../../components/AreaChart";
import TLoader from "../../components/common/TLoader";

/* ---------------------------------------- */
/* CONSTANTS                                */
/* ---------------------------------------- */

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const START_YEAR = 2020;
const CURRENT_DATE = new Date();
const CURRENT_MONTH = CURRENT_DATE.getMonth();   // 0-indexed
const CURRENT_YEAR = CURRENT_DATE.getFullYear();

/* ---------------------------------------- */
/* MONTH-YEAR PICKER MODAL                  */
/* ---------------------------------------- */

interface MonthYearPickerProps {
  visible: boolean;
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
  theme: any;
}

function MonthYearPicker({
  visible,
  selectedMonth,
  selectedYear,
  onSelect,
  onClose,
  theme,
}: MonthYearPickerProps) {
  const [tempYear, setTempYear] = useState(selectedYear);

  const years = Array.from(
    { length: CURRENT_YEAR - START_YEAR + 1 },
    (_, i) => START_YEAR + i
  ).reverse();

  const handleMonthPress = (monthIndex: number) => {
    onSelect(monthIndex, tempYear);
    onClose();
  };

  const isDisabled = (monthIndex: number) =>
    tempYear === CURRENT_YEAR && monthIndex > CURRENT_MONTH;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <View
        style={[
          styles.pickerSheet,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: theme.border }]} />

        {/* Title */}
        <Text style={[styles.pickerTitle, { color: theme.text }]}>
          Select Period
        </Text>

        {/* Year Row */}
        <View style={styles.yearRow}>
          <TouchableOpacity
            onPress={() => setTempYear((y) => Math.max(START_YEAR, y - 1))}
            style={[styles.yearBtn, { backgroundColor: theme.background }]}
            disabled={tempYear <= START_YEAR}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={tempYear <= START_YEAR ? theme.border : theme.text}
            />
          </TouchableOpacity>

          <Text style={[styles.yearText, { color: theme.text }]}>
            {tempYear}
          </Text>

          <TouchableOpacity
            onPress={() => setTempYear((y) => Math.min(CURRENT_YEAR, y + 1))}
            style={[styles.yearBtn, { backgroundColor: theme.background }]}
            disabled={tempYear >= CURRENT_YEAR}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={tempYear >= CURRENT_YEAR ? theme.border : theme.text}
            />
          </TouchableOpacity>
        </View>

        {/* Month Grid */}
        <View style={styles.monthGrid}>
          {MONTHS.map((month, index) => {
            const disabled = isDisabled(index);
            const isSelected =
              index === selectedMonth && tempYear === selectedYear;
            return (
              <TouchableOpacity
                key={month}
                onPress={() => !disabled && handleMonthPress(index)}
                style={[
                  styles.monthCell,
                  isSelected && { backgroundColor: "#8B5CF6" },
                  disabled && { opacity: 0.3 },
                ]}
                activeOpacity={disabled ? 1 : 0.7}
              >
                <Text
                  style={[
                    styles.monthLabel,
                    { color: isSelected ? "#fff" : theme.text },
                  ]}
                >
                  {month.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

/* ---------------------------------------- */
/* SUMMARY CARD                             */
/* ---------------------------------------- */
function SummaryCard({
  label,
  amount,
  icon,
  color,
  theme,
}: {
  label: string;
  amount: number;
  icon: string;
  color: string;
  theme: any;
}) {
  return (
    <View
      style={[
        styles.summaryCard,
        { backgroundColor: `${color}15`, borderColor: `${color}30` },
      ]}
    >
      <View style={[styles.summaryIcon, { backgroundColor: `${color}25` }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={[styles.summaryLabel, { color: theme.subText }]}>
        {label}
      </Text>
      <Text style={[styles.summaryAmount, { color: theme.text }]}>
        ₹{amount.toLocaleString("en-IN")}
      </Text>
    </View>
  );
}

/* ---------------------------------------- */
/* CATEGORY ROW                             */
/* ---------------------------------------- */
function CategoryRow({
  item,
  theme,
  maxAmount,
}: {
  item: any;
  theme: any;
  maxAmount: number;
}) {
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barWidth, {
      toValue: maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [item.amount, maxAmount]);

  return (
    <View style={styles.categoryRow}>
      {/* Icon */}
      <View
        style={[
          styles.categoryIcon,
          { backgroundColor: `${item.color}20` },
        ]}
      >
        <Ionicons name={item.icon as any} size={20} color={item.color} />
      </View>

      {/* Info */}
      <View style={styles.categoryInfo}>
        <View style={styles.categoryTopRow}>
          <Text style={[styles.categoryName, { color: theme.text }]}>
            {item.label}
          </Text>
          <Text style={[styles.categoryAmount, { color: theme.text }]}>
            ₹{item.amount.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={[styles.barBg, { backgroundColor: theme.background }]}
        >
          <Animated.View
            style={[
              styles.barFill,
              {
                backgroundColor: item.color,
                width: barWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>

        <Text style={[styles.categoryPercent, { color: theme.subText }]}>
          {item.percent}% of total
        </Text>
      </View>
    </View>
  );
}

/* ---------------------------------------- */
/* MAIN SCREEN                              */
/* ---------------------------------------- */
export default function ReportsScreen() {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  /* -------------------------------- */
  /* FETCH ALL TRANSACTIONS           */
  /* -------------------------------- */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("date", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* -------------------------------- */
  /* FILTER BY SELECTED MONTH/YEAR    */
  /* -------------------------------- */
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const d = new Date(
        item.date?.seconds ? item.date.seconds * 1000 : item.date
      );
      return (
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  /* -------------------------------- */
  /* EXPENSE / INCOME SPLIT           */
  /* -------------------------------- */
  const expenseTransactions = useMemo(
    () => filteredTransactions.filter((t) => t.type === "expense"),
    [filteredTransactions]
  );

  const incomeTransactions = useMemo(
    () => filteredTransactions.filter((t) => t.type === "income"),
    [filteredTransactions]
  );

  const totalExpense = useMemo(
    () => expenseTransactions.reduce((s, t) => s + Number(t.amount || 0), 0),
    [expenseTransactions]
  );

  const totalIncome = useMemo(
    () => incomeTransactions.reduce((s, t) => s + Number(t.amount || 0), 0),
    [incomeTransactions]
  );

  const netBalance = totalIncome - totalExpense;

  /* -------------------------------- */
  /* CATEGORY DATA                    */
  /* -------------------------------- */
  const categoryData = useMemo(() => {
    const grouped: any = {};
    expenseTransactions.forEach((item) => {
      if (!grouped[item.categoryName]) {
        grouped[item.categoryName] = {
          label: item.categoryName,
          amount: 0,
          color: item.categoryColor,
          icon: item.categoryIcon,
        };
      }
      grouped[item.categoryName].amount += Number(item.amount);
    });

    return Object.values(grouped)
      .map((item: any) => ({
        ...item,
        percent: totalExpense > 0
          ? Math.round((item.amount / totalExpense) * 100)
          : 0,
      }))
      .sort((a: any, b: any) => b.amount - a.amount);
  }, [expenseTransactions, totalExpense]);

  const maxCategoryAmount = useMemo(
    () =>
      categoryData.length > 0
        ? Math.max(...categoryData.map((c: any) => c.amount))
        : 0,
    [categoryData]
  );

  /* -------------------------------- */
  /* CHART DATA (daily expenses)      */
  /* -------------------------------- */
  const chartData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    // Weekly buckets: W1(1-7), W2(8-14), W3(15-21), W4(22-end)
    const weeks = [0, 0, 0, 0];
    expenseTransactions.forEach((item) => {
      const d = new Date(
        item.date?.seconds ? item.date.seconds * 1000 : item.date
      );
      const day = d.getDate();
      const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);
      weeks[weekIndex] += Number(item.amount);
    });

    return {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
      values: weeks,
    };
  }, [expenseTransactions, selectedMonth, selectedYear]);

  /* -------------------------------- */
  /* LABEL                            */
  /* -------------------------------- */
  const periodLabel = `${MONTHS[selectedMonth]} ${selectedYear}`;

  /* -------------------------------- */
  /* RENDER                           */
  /* -------------------------------- */
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <TLoader visible={loading} color={theme.primary} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
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
            Reports
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* PERIOD SELECTOR */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setPickerVisible(true)}
          style={[
            styles.periodSelector,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.periodLeft}>
            <View style={styles.periodDot} />
            <Text style={[styles.periodText, { color: theme.text }]}>
              {periodLabel}
            </Text>
          </View>
          <Ionicons name="calendar-outline" size={20} color={theme.primary} />
        </TouchableOpacity>

        {/* SUMMARY CARDS ROW */}
        <View style={styles.summaryRow}>
          <SummaryCard
            label="Income"
            amount={totalIncome}
            icon="trending-up-outline"
            color="#22C55E"
            theme={theme}
          />
          <SummaryCard
            label="Expense"
            amount={totalExpense}
            icon="trending-down-outline"
            color="#EF4444"
            theme={theme}
          />
        </View>

        {/* NET BALANCE */}
        <View
          style={[
            styles.netCard,
            {
              backgroundColor: netBalance >= 0 ? "#22C55E15" : "#EF444415",
              borderColor: netBalance >= 0 ? "#22C55E30" : "#EF444430",
            },
          ]}
        >
          <Text style={[styles.netLabel, { color: theme.subText }]}>
            Net Balance
          </Text>
          <Text
            style={[
              styles.netAmount,
              { color: netBalance >= 0 ? "#22C55E" : "#EF4444" },
            ]}
          >
            {netBalance >= 0 ? "+" : ""}₹
            {Math.abs(netBalance).toLocaleString("en-IN")}
          </Text>
        </View>

        {/* CHART CARD */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Spending Trend
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.subText }]}>
              Weekly breakdown
            </Text>
          </View>

          <Text style={[styles.totalExpLabel, { color: theme.subText }]}>
            Total Spent
          </Text>
          <Text style={[styles.totalExpAmount, { color: theme.text }]}>
            ₹{totalExpense.toLocaleString("en-IN")}.00
          </Text>

          <View style={{ marginTop: 16 }}>
            <AnimatedAreaChart
              labels={chartData.labels}
              values={chartData.values}
              width={width - 70}
              height={210}
              color="#8B5CF6"
              backgroundColor={theme.card}
              labelColor={theme.subText}
            />
          </View>
        </View>

        {/* CATEGORY CARD */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              marginBottom: 0,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Top Categories
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.subText }]}>
              {categoryData.length} categories
            </Text>
          </View>

          {categoryData.length === 0 ? (
            <View style={styles.emptyState}>
              <View
                style={[
                  styles.emptyIconBg,
                  { backgroundColor: theme.background },
                ]}
              >
                <Ionicons
                  name="analytics-outline"
                  size={36}
                  color={theme.subText}
                />
              </View>
              <Text style={[styles.emptyText, { color: theme.subText }]}>
                No expenses for {periodLabel}
              </Text>
            </View>
          ) : (
            categoryData.map((item: any) => (
              <CategoryRow
                key={item.label}
                item={item}
                theme={theme}
                maxAmount={maxCategoryAmount}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* MONTH/YEAR PICKER */}
      <MonthYearPicker
        visible={pickerVisible}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSelect={(m, y) => {
          setSelectedMonth(m);
          setSelectedYear(y);
        }}
        onClose={() => setPickerVisible(false)}
        theme={theme}
      />
    </SafeAreaView>
  );
}

/* ---------------------------------------- */
/* STYLES                                   */
/* ---------------------------------------- */

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  // Period selector
  periodSelector: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  periodLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  periodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  periodText: {
    fontSize: 15,
    fontWeight: "700",
  },

  // Summary cards
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  // Net card
  netCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  netLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  netAmount: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  // Generic card
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  totalExpLabel: {
    fontSize: 12,
    marginTop: 12,
  },
  totalExpAmount: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
  },

  // Category row
  categoryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    gap: 14,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "700",
  },
  barBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  categoryPercent: {
    fontSize: 11,
    marginTop: 4,
  },

  // Empty
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 12,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },

  // Picker modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  pickerSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 24,
  },
  yearBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  yearText: {
    fontSize: 22,
    fontWeight: "800",
    minWidth: 80,
    textAlign: "center",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  monthCell: {
    width: "28%",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
