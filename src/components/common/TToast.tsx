import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

type Props = {
    message: string;
    type?: 'success' | 'error';
};

export default function TToast({
    message,
    type = 'success',
}: Props) {
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                        type === 'success'
                            ? '#b3efc8'
                            : '#f4c4bd',
                },
            ]}
        >
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 12,
        zIndex: 999,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: '600',
    },
});