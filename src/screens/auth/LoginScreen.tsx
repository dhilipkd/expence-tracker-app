import React, { useState } from 'react';
import {
    View,
    Text,
    useColorScheme,
    useWindowDimensions,
    TouchableOpacity,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types/navigation.types';

import { useTheme } from "../../hooks/ThemeContext";

import AuthHeader from '../../components/auth/AuthHeader';
import TCustomInputField from '../../components/common/TCustomInputField';
import TPrimaryButton from '../../components/common/TPrimaryButton';
import TKeyboardWrapper from '../../components/common/TKeyboardWrapper';
import TLoader from '../../components/common/TLoader';
import TFormError from '../../components/common/TFormError';
import TAuthFooter from '../../components/auth/TAuthFooter';

import { Ionicons } from "@expo/vector-icons";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../../config/firebase";

import { loginUser } from '../../services/authService';


type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Login'
>;

type FormDataType = {
    email: string;
    password: string;
};

export default function LoginScreen() {
    const navigation = useNavigation<NavigationProp>();

    const colorScheme = useColorScheme();

    const { theme } = useTheme();

    const { width } = useWindowDimensions();

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [focusedField, setFocusedField] = useState('');

    const [hidePassword, setHidePassword] = useState(true);

    const [formData, setFormData] =
        useState<FormDataType>({
            email: '',
            password: '',
        });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        api: '',
    });

    WebBrowser.maybeCompleteAuthSession();

    const [request, response, promptAsync] =
        Google.useAuthRequest({
            androidClientId: "YOUR_ANDROID_CLIENT_ID",
            iosClientId: "YOUR_IOS_CLIENT_ID",
            webClientId: "YOUR_WEB_CLIENT_ID",
        });

    const handleChange = (
        key: keyof FormDataType,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [key]: '',
        }));
    };

    const validateForm = () => {
        let valid = true;

        const newErrors = {
            email: '',
            password: '',
            api: '',
        };

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else {
            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Invalid email format';
                valid = false;
            }
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (formData.password.length < 8) {
            newErrors.password =
                'Password must be at least 8 characters';
            valid = false;
        }

        setErrors(newErrors);

        return valid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const response = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            if (!response.success) {
                setErrors((prev) => ({
                    ...prev,
                    api: response.message,
                }));
            }
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                api: 'Login failed',
            }));
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setFormData({
            email: '',
            password: '',
        });
        setErrors({
            email: '',
            password: '',
            api: '',
        });
        setFocusedField('');
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    React.useEffect(() => {
        const handleGoogleLogin = async () => {
            try {
                if (response?.type !== "success") return;

                const authentication = response.authentication;

                const idToken = authentication?.idToken;
                const accessToken = authentication?.accessToken;

                if (!idToken) {
                    console.log("Google Login Failed: No idToken");
                    return;
                }

                const credential = GoogleAuthProvider.credential(
                    idToken,
                    accessToken
                );

                const userCredential =
                    await signInWithCredential(auth, credential);

                if (userCredential.user) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "MainTabs" }],
                    });
                }
            } catch (error) {
                console.log("Google Login Error:", error);
            }
        };

        handleGoogleLogin();
    }, [response]);

    return (
        <TKeyboardWrapper
            backgroundColor={theme.background}
            paddingHorizontal={width * 0.08}
            refreshing={refreshing}
            onRefresh={onRefresh}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                }}
            >
                <TLoader
                    visible={loading}
                    color={theme.primary}
                />

                <AuthHeader
                    title="Welcome Back"
                    subtitle="Sign in to Continue"
                    theme={theme}
                    width={width}
                />

                <TCustomInputField
                    label="Email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChangeText={(value) =>
                        handleChange('email', value)
                    }
                    keyboardType="email-address"
                    theme={theme}
                    focused={focusedField === 'email'}
                    onFocus={() =>
                        setFocusedField('email')
                    }
                    onBlur={() => setFocusedField('')}
                />

                <TFormError
                    message={errors.email}
                />

                <TCustomInputField
                    label="Password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChangeText={(value) =>
                        handleChange('password', value)
                    }
                    secure
                    hidePassword={hidePassword}
                    togglePassword={() =>
                        setHidePassword(!hidePassword)
                    }
                    theme={theme}
                    focused={focusedField === 'password'}
                    onFocus={() =>
                        setFocusedField('password')
                    }
                    onBlur={() => setFocusedField('')}
                />

                <TFormError
                    message={errors.password}
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword' as never)}
                >
                    <Text
                        style={{
                            color: theme.primary,
                            alignSelf: 'flex-end',
                            marginBottom: 20,
                        }}
                    >
                        Forgot Password?
                    </Text>
                </TouchableOpacity>

                <TFormError message={errors.api} />

                <TPrimaryButton
                    title={
                        loading
                            ? 'Login Account...'
                            : 'Login'
                    }
                    theme={theme}
                    onPress={handleLogin}
                />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 20,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: theme.border,
                        }}
                    />

                    <Text
                        style={{
                            marginHorizontal: 10,
                            color: theme.subText,
                            fontSize: 12,
                            fontWeight: "500",
                        }}
                    >
                        OR
                    </Text>

                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: theme.border,
                        }}
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity
                        onPress={() => promptAsync()}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 14,
                            borderRadius: 12,
                            backgroundColor: theme.input,
                            borderWidth: 1,
                            borderColor: theme.border,
                        }}
                    >
                        <Ionicons
                            name="logo-google"
                            size={20}
                            color={theme.text}
                            style={{ marginRight: 10 }}
                        />

                        <Text style={{ color: theme.text, fontWeight: "600" }}>
                            Continue with Google
                        </Text>
                    </TouchableOpacity>
                </View>

                <TAuthFooter
                    text="Don't have an account?"
                    actionText="Signup"
                    actionColor={theme.primary}
                    onPress={() =>
                        navigation.navigate('Signup')
                    }
                />
            </View>
        </TKeyboardWrapper>
    );
}