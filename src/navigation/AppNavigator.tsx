import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import { AuthProvider, useAuth } from "../hooks/AuthProvider";
import { ThemeProvider } from "../hooks/ThemeContext";
import { View, ActivityIndicator } from "react-native";

function RootNavigator() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <AuthNavigator />;
}

export default function AppNavigator() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <NavigationContainer>
                    <RootNavigator />
                </NavigationContainer>
            </AuthProvider>
        </ThemeProvider>
    );
}