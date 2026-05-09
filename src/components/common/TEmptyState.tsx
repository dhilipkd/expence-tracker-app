import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

type Props = {
    title: string;
    subtitle?: string;
};

export default function TEmptyState({
    title,
    subtitle,
}: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>

            {subtitle ? (
                <Text style={styles.subtitle}>
                    {subtitle}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.7,
        paddingHorizontal: 20,
    },
});