import React, { ReactNode } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    RefreshControl,
    ViewStyle,
} from 'react-native';

type Props = {
    children: ReactNode;
    backgroundColor?: string;
    paddingHorizontal?: number;
    refreshing?: boolean;
    onRefresh?: () => void;
    style?: ViewStyle;
};

export default function TKeyboardWrapper({
    children,
    backgroundColor = '#fff',
    paddingHorizontal = 20,
    refreshing,
    onRefresh,
    style,
}: Props) {
    return (
        <KeyboardAvoidingView
            style={[{
                flex: 1,
                backgroundColor,
            }, style]}
            behavior={
                Platform.OS === 'ios'
                    ? 'padding'
                    : 'height'
            }
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    paddingHorizontal,
                }}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl
                            refreshing={!!refreshing}
                            onRefresh={onRefresh}
                        />
                    ) : undefined
                }
            >
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {children}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}