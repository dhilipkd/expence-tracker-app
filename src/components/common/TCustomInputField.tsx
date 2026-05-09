import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ViewStyle,
    KeyboardTypeOptions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

type inputProps = {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    theme?: any;
    focused?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    secure?: boolean;
    hidePassword?: boolean;
    togglePassword?: () => void;
    keyboardType?: KeyboardTypeOptions;
    style?: ViewStyle;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    onSubmitEditing?: () => void;
};

export default function TCustomInputField({
    label,
    placeholder,
    value,
    onChangeText,
    theme,
    focused,
    onFocus,
    onBlur,
    secure = false,
    hidePassword,
    togglePassword,
    keyboardType = 'default',
    style,
    autoCapitalize = 'none',
    onSubmitEditing,
}: inputProps) {
    return (
        <View style={{ width: '100%', marginBottom: 18 }}>

            {/* LABEL */}
            {label && (
                <Text
                    style={{
                        color: theme.text,
                        marginBottom: 6,
                        fontWeight: '600',
                    }}
                >
                    {label}
                </Text>
            )}

            <View style={{ position: 'relative' }}>

                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={theme.subText}

                    value={value}
                    onChangeText={onChangeText}

                    keyboardType={keyboardType}

                    secureTextEntry={
                        secure
                            ? hidePassword
                            : false
                    }

                    onFocus={onFocus}
                    onBlur={onBlur}
                    autoCapitalize={autoCapitalize}
                    onSubmitEditing={onSubmitEditing}

                    style={[
                        {
                            backgroundColor: theme.input,
                            color: theme.text,

                            borderColor:
                                focused
                                    ? theme.primary
                                    : theme.border,

                            borderWidth: 1.5,
                            borderRadius: 12,

                            padding: 15,

                            paddingRight:
                                secure
                                    ? 50
                                    : 15,
                        },
                        style,
                    ]}
                />

                {/* PASSWORD TOGGLE */}
                {secure && (
                    <TouchableOpacity
                        onPress={togglePassword}
                        style={{
                            position: 'absolute',
                            right: 15,
                            top: 15,
                        }}
                    >
                        <Ionicons
                            name={
                                hidePassword
                                    ? 'eye-off-outline'
                                    : 'eye-outline'
                            }
                            size={20}
                            color={theme.subText}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}