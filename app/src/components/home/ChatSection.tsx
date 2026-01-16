import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

interface ChatSectionProps {
    onOpenChat: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ onOpenChat }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Stay Connected</Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>💬</Text>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>
                        Share your thoughts, feelings, and daily moments with your partner in a private space just for you two.
                    </Text>

                    {/* Button */}
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={onOpenChat}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.chatButtonText}>Open Chat</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: THEME.spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.textPrimary,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: THEME.spacing.lg,
        overflow: 'hidden',
    },
    cardContent: {
        gap: THEME.spacing.md,
        alignItems: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 107, 157, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.xs,
    },
    icon: {
        fontSize: 32,
    },
    description: {
        fontSize: THEME.fontSizes.sm,
        color: COLORS.textMuted,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: THEME.spacing.sm,
    },
    chatButton: {
        backgroundColor: COLORS.white,
        paddingVertical: THEME.spacing.sm,
        paddingHorizontal: THEME.spacing.xl,
        borderRadius: THEME.borderRadius.lg,
        height: 48,
        minWidth: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatButtonText: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
        color: '#1F1F1F',
    },
});
