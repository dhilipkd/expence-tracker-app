import React from 'react';
import { View, Text } from 'react-native';

type Props = {
    title: string;
    subtitle: string;
    theme: any;
    width: number;
};

export default function AuthHeader({
    title,
    subtitle,
    theme,
    width,
}: Props) {
    return (
        <View style={{ marginBottom: 30 }}>
            <Text
                style={{
                    color: theme.primary,
                    fontSize: width * 0.08,
                    fontWeight: '700',
                    textAlign: 'center',
                }}
            >
                {title}
            </Text>

            <Text
                style={{
                    color: theme.subText,
                    fontSize: width * 0.045,
                    marginTop: 4,
                    textAlign: 'center',
                }}
            >
                {subtitle}
            </Text>
        </View>
    );
}