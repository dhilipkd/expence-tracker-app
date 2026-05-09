import React from 'react';
import {
    Text,
    StyleSheet,
} from 'react-native';

type Props = {
    message?: string;
};

export default function TFormError({
    message,
}: Props) {
    if (!message) return null;

    return (
        <Text style={styles.errorText}>
            {message}
        </Text>
    );
}

const styles = StyleSheet.create({
    errorText: {
        color: '#ef4444',
        fontSize: 13,
        marginTop: 4,
        marginBottom: 10,
    },
});