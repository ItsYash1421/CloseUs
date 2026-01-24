import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';

export const GamesHeader = () => {
    const user = useAuthStore(state => state.user);
    const partner = useCoupleStore(state => state.partner);

    const userName = user?.name?.split(' ')[0]?.toUpperCase() || 'ME';
    const partnerName = partner?.name?.split(' ')[0]?.toUpperCase() || 'PARTNER';

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Games Hub</Text>
                <Text style={styles.subtitle}>
                    CLOSEUS FOR {userName} & {partnerName}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingHorizontal removed because parent container already has padding
        paddingTop: THEME.spacing.md, // Adjusted for visual balance
        paddingBottom: THEME.spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 4,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textSecondary,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
});
