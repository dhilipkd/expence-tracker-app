import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    useWindowDimensions,
} from "react-native";

import { useTheme } from "../../hooks/ThemeContext";

import TCustomInputField from "../../components/common/TCustomInputField";
import TPrimaryButton from "../../components/common/TPrimaryButton";
import AuthHeader from "../../components/auth/AuthHeader";
import TLoader from "../../components/common/TLoader";
import TToast from "../../components/common/TToast";

import { forgotPassword } from "../../services/authService";

export default function ForgotPasswordScreen() {
    const { theme } = useTheme();

    const { width } = useWindowDimensions();

    const [email, setEmail] = useState("");
    const [focusedField, setFocusedField] = useState("");
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState<{
        visible: boolean;
        message: string;
        type: "success" | "error";
    }>({
        visible: false,
        message: "",
        type: "success",
    });

    const showToast = (
        message: string,
        type: "success" | "error"
    ) => {
        setToast({
            visible: true,
            message,
            type,
        });

        setTimeout(() => {
            setToast((prev) => ({
                ...prev,
                visible: false,
            }));
        }, 2500);
    };

    const handleSend = async () => {
        if (!email.trim()) {
            showToast("Email required", "error");
            return;
        }

        try {
            setLoading(true);

            const res = await forgotPassword({ email });

            if (res.success) {
                showToast(res.message, "success");
                setEmail("");
            } else {
                showToast(res.message, "error");
            }
        } catch (err) {
            showToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: width * 0.08,
                backgroundColor: theme.background,
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/* LOADER */}
            <TLoader visible={loading} color={theme.primary} />

            {/* TOAST */}
            {toast.visible && (
                <TToast
                    message={toast.message}
                    type={toast.type}
                />
            )}

            <AuthHeader
                title="Forgot Password"
                subtitle="Enter email to reset password"
                theme={theme}
                width={width}
            />

            <TCustomInputField
                label="Email"
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                theme={theme}
                focused={focusedField === "email"}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
            />

            <TPrimaryButton
                title={loading ? "Sending..." : "Send Reset Link"}
                theme={theme}
                onPress={handleSend}
            />
        </KeyboardAvoidingView>
    );
}