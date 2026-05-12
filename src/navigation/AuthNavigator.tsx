  import React from "react";
  import { createNativeStackNavigator } from "@react-navigation/native-stack";

  import LoginScreen from "../screens/auth/LoginScreen";
  import SignupScreen from "../screens/auth/SignupScreen";
  import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
  import OnboardingScreen from "../screens/OnboardingScreen";
  import BottomTabs from "./BottomTabs";
  import SettingsScreen from "../screens/main/ProfileSettingsModules/SettingsScreen";

  import { useAuth } from "../hooks/AuthProvider";

  import { View, ActivityIndicator } from "react-native";
  import ThemeScreen from "../screens/main/ProfileSettingsModules/ThemeScreen";
  import CustomCategoryScreen from "../screens/main/ProfileSettingsModules/CustomCategory";
  import CreateCategoryScreen from "../screens/main/ProfileSettingsModules/CreateCategoryScreen";
  import TransactionsScreen from "../screens/main/TransactionsScreen";
  import TransactionDetailsScreen from "../screens/main/TransactionDetailsScreen";
  import CreateTransactionScreen from "../screens/main/CreateTransactionsScreen";
  import ReportsScreen from "../screens/main/ReportScreen";


  const Stack = createNativeStackNavigator();


  export default function AuthNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <Stack.Navigator 
      id="AuthStack"
      screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Group>
              <Stack.Screen name="MainTabs" component={BottomTabs} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Themes" component={ThemeScreen} />
              <Stack.Screen name="CustomCategory" component={CustomCategoryScreen} />
              <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
              <Stack.Screen name="CreateTransaction" component={CreateTransactionScreen} />
              <Stack.Screen name="Transactions" component={TransactionsScreen} />
              <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
              <Stack.Screen name="Reports" component={ReportsScreen} />
            </Stack.Group>
          </>
        ) : (
          <>
            <Stack.Group>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    );
  }