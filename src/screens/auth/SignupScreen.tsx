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

import { signupUser } from '../../services/authService';


type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Signup'
>;

type FormDataType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};


export default function SignupScreen() {
    const navigation = useNavigation<NavigationProp>();

    const colorScheme = useColorScheme();

    const { theme } = useTheme();

    const { width } = useWindowDimensions();

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [focusedField, setFocusedField] = useState('');

    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);


    const [formData, setFormData] =
        useState<FormDataType>({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            api: '',
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            valid = false;
        }

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

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword =
                'Confirm password is required';
            valid = false;
        }
        if (
            formData.password &&
            formData.confirmPassword &&
            formData.password !==
            formData.confirmPassword
        ) {
            newErrors.confirmPassword =
                'Passwords do not match';
            valid = false;
        }

        setErrors(newErrors);

        return valid;
    };

    const handleSignup = async () => {
        const isValid = validateForm();

        if (!isValid) return;

        try {
            setLoading(true);

            const response = await signupUser({
                name: formData.name,
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
                api: 'Signup failed',
            }));
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);

        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });

        setErrors({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
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
                    title="Create Account"
                    subtitle="Sign up to get started"
                    theme={theme}
                    width={width}
                />

                <TCustomInputField
                    label="Name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChangeText={(value) =>
                        handleChange('name', value)
                    }
                    theme={theme}
                    focused={focusedField === 'name'}
                    onFocus={() =>
                        setFocusedField('name')
                    }
                    onBlur={() => setFocusedField('')}
                />

                <TFormError
                    message={errors.name}
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

                <TCustomInputField
                    label="Confirm Password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChangeText={(value) =>
                        handleChange(
                            'confirmPassword',
                            value
                        )
                    }
                    secure
                    hidePassword={hideConfirmPassword}
                    togglePassword={() =>
                        setHideConfirmPassword(
                            !hideConfirmPassword
                        )
                    }
                    theme={theme}
                    focused={
                        focusedField ===
                        'confirmPassword'
                    }
                    onFocus={() =>
                        setFocusedField(
                            'confirmPassword'
                        )
                    }
                    onBlur={() => setFocusedField('')}
                />

                <TFormError
                    message={errors.confirmPassword}
                />

                <TFormError message={errors.api} />

                <TPrimaryButton
                    title={
                        loading
                            ? 'Creating Account...'
                            : 'Sign Up'
                    }
                    theme={theme}
                    onPress={handleSignup}
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
                    text="Already have an account?"
                    actionText="Login"
                    actionColor={theme.primary}
                    onPress={() =>
                        navigation.navigate('Login')
                    }
                />
            </View>
        </TKeyboardWrapper>
    );
}