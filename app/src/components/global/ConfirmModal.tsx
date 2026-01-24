import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmColor?: string;
    type?: 'warning' | 'error' | 'info';
    loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    confirmColor,
    type = 'info',
    loading = false,
}) => {
    const getConfirmButtonColor = () => {
        if (confirmColor) return confirmColor;
        switch (type) {
            case 'warning':
                return '#FF6B9D';
            case 'error':
                return '#EF4444';
            default:
                return '#FF6B9D';
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => onCancel?.()}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {cancelText && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => onCancel?.()}
                                activeOpacity={0.7}
                                disabled={loading}
                            >
                                <Text style={[styles.cancelText, loading && styles.disabledText]}>
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.confirmButton,
                                { backgroundColor: getConfirmButtonColor() },
                                loading && styles.disabledButton,
                                !cancelText && styles.fullWidthButton,
                            ]}
                            onPress={onConfirm}
                            activeOpacity={0.7}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.confirmText}>{confirmText}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
    },
    confirmButton: {
        backgroundColor: '#FF6B9D',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    confirmText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    disabledButton: {
        opacity: 0.6,
    },
    disabledText: {
        opacity: 0.5,
    },
    fullWidthButton: {
        flex: 1,
        minWidth: '100%',
    },
});
