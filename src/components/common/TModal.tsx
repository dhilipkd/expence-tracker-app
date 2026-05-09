import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

type Props = {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
};

export default function TModal({
    visible,
    title,
    message,
    onClose,
    onConfirm,
}: Props) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    <Text style={styles.message}>
                        {message}
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>

                        {onConfirm && (
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={onConfirm}
                            >
                                <Text style={{ color: '#fff' }}>
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 20,
    },
    modalBox: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
    },
    message: {
        fontSize: 14,
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    confirmButton: {
        backgroundColor: '#111',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },

});