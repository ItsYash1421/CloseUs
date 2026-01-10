import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal } from 'react-native';
import NetworkLogger from 'react-native-network-logger';
import { COLORS } from '../constants/colors';
import THEME from '../constants/theme';

export const NetworkLoggerButton: React.FC = () => {
    const [visible, setVisible] = useState(false);

    // Only show in dev mode
    if (!__DEV__) {
        return null;
    }

    return (
        <>
            {/* Floating NL Button */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setVisible(true)}
                activeOpacity={0.8}>
                <Text style={styles.buttonText}>NL</Text>
            </TouchableOpacity>

            {/* Network Logger Modal */}
            <Modal
                visible={visible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setVisible(false)}>
                <View style={styles.container}>
                    {/* Close Button */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Network Logger</Text>
                        <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Default Network Logger */}
                    <NetworkLogger />
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        top: 50,
        right: 16,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 9999,
    },
    buttonText: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.lg,
        paddingTop: THEME.spacing.xxl,
        paddingBottom: THEME.spacing.md,
        backgroundColor: '#252525',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    title: {
        fontSize: THEME.fontSizes.xl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 24,
        color: COLORS.white,
        fontWeight: THEME.fontWeights.bold,
    },
});
