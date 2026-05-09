import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useColorScheme, useWindowDimensions, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "../screens/main/DashboardScreen";
import TransactionsScreen from "../screens/main/TransactionsScreen";
import CreateTransactionsScreen from "../screens/main/CreateTransactionsScreen";
import ReportScreen from "../screens/main/ReportScreen";
import ProfileSettingsScreen from "../screens/main/ProfileSettingsScreen";

import { useTheme } from "../hooks/ThemeContext";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const colorScheme = useColorScheme();

  const { theme } = useTheme();

  const { width } = useWindowDimensions();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          position: "absolute",
          left: width * 0.05,
          right: width * 0.05,
          height: width * 0.22,

          borderTopRightRadius: width * 0.1,
          borderTopLeftRadius: width * 0.1,
          paddingBottom: 10,
          paddingTop: 10,
        },

        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: theme.card,

              borderTopLeftRadius: width * 0.1,
              borderTopRightRadius: width * 0.1,

              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: {
                width: 10,
                height: -30,
              },
              elevation: 15,
            }}
          />
        ),

        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subText,

        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 3,
          fontWeight: "600",
        },

        tabBarIcon: ({ focused, color }) => {
          let iconName:
            | "home"
            | "home-outline"
            | "swap-horizontal"
            | "swap-horizontal-outline"
            | "add"
            | "add-outline"
            | "stats-chart"
            | "stats-chart-outline"
            | "person"
            | "person-outline";
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Transactions") {
            iconName = focused ? "swap-horizontal" : "swap-horizontal-outline";
          } else if (route.name === "CreateTransaction") {
            iconName = focused ? "add" : "add-outline";
          } else if (route.name === "Report") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          } else {
            iconName = focused ? "person" : "person-outline";
          }

          if (
            route.name === "CreateTransaction"
          ) {
            return (
              <View
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: 35,

                  backgroundColor: "#22C55E",

                  justifyContent: "center",
                  alignItems: "center",

                  marginLeft: 10,

                  shadowColor: "#22C55E",
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  elevation: 10,
                }}
              >
                <Ionicons
                  name="add"
                  size={34}
                  color="#fff"
                />
              </View>
            );
          }
          return (
            <Ionicons
              name={iconName}
              size={24}
              color={color}
            />
          );
        },
      })
      }
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="CreateTransaction" component={CreateTransactionsScreen} options={{ tabBarLabel: "" }} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ tabBarLabel: "Profile" }} />
    </ Tab.Navigator >
  )
}