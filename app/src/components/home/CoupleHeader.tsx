import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

interface CoupleHeaderProps {
    date?: string;
    coupleHashtag?: string;
    userName?: string;
    partnerName?: string;
    userAvatar?: string;
    partnerAvatar?: string;
    isOnline?: boolean;
}

export const CoupleHeader: React.FC<CoupleHeaderProps> = ({
    date,
    coupleHashtag,
    userName,
    partnerName,
    userAvatar,
    partnerAvatar,
    isOnline = true,
}) => {
    // Format current date if not provided
    const getFormattedDate = () => {
        if (date) return date;

        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[now.getDay()];
        const day = now.getDate();
        const month = months[now.getMonth()];

        return `${dayName.toUpperCase()}, ${day} ${month.toUpperCase()}`;
    };

    // Generate greeting text with names
    const getGreeting = () => {
        const user = userName || 'Yas';
        const partner = partnerName || 'Ama';
        return `Hi, ${user} & ${partner}!`;
    };

    return (
        <View style={styles.container}>
            {/* Left side - Date and Greeting */}
            <View style={styles.leftSection}>
                <Text style={styles.dateText}>{getFormattedDate()}</Text>
                <Text style={styles.greetingText}>{getGreeting()}</Text>
                {coupleHashtag && (
                    <Text style={styles.hashtagText}>{coupleHashtag}</Text>
                )}
            </View>

            {/* Right side - Couple Avatars */}
            <View style={styles.avatarsContainer}>
                {/* User Avatar - Use profile image or fallback to male logo */}
                <View style={[styles.avatarWrapper, styles.avatarLeft]}>
                    <Image
                        source={userAvatar ? { uri: userAvatar } : require('../../assets/images/Logo-Male-2.png')}
                        style={styles.avatar}
                    />
                </View>

                {/* Partner Avatar - Use profile image or fallback to female logo */}
                <View style={[styles.avatarWrapper, styles.avatarRight]}>
                    <Image
                        source={partnerAvatar ? { uri: partnerAvatar } : require('../../assets/images/Logo-Female-2.png')}
                        style={styles.avatar}
                    />
                </View>

                {/* Online Indicator */}
                {isOnline && <View style={styles.onlineIndicator} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.lg,
        paddingTop: THEME.spacing.xl,
        paddingBottom: THEME.spacing.md,
    },
    leftSection: {
        flex: 1,
    },
    dateText: {
        fontSize: THEME.fontSizes.xs,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.textMuted,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    greetingText: {
        fontSize: 28,
        fontWeight: THEME.fontWeights.extrabold,
        color: COLORS.textPrimary,
        marginTop: THEME.spacing.xs,
        lineHeight: 34,
    },
    hashtagText: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.primaryLight,
        marginTop: THEME.spacing.xs,
        letterSpacing: 0.5,
    },
    avatarsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    avatarWrapper: {
        borderRadius: 24,
        borderWidth: 3,
        borderColor: COLORS.background,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        backgroundColor: COLORS.background, // Ensure background matches
    },
    avatarLeft: {
        zIndex: 10,
    },
    avatarRight: {
        zIndex: 20,
        marginLeft: -16, // More overlap for better visual
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.backgroundCard, // Background for logos
    },
    onlineIndicator: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#4ADE80', // Green color
        borderWidth: 3,
        borderColor: COLORS.background,
        zIndex: 30,
    },
});
