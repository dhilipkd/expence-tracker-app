import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

type Props = {
    visible: boolean;
    color?: string;
};

export default function TLoader({
    visible,
    color = '#000',
}: Props) {
    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <ActivityIndicator
                size="large"
                color={color}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.35)',
        zIndex: 999,
    },
});