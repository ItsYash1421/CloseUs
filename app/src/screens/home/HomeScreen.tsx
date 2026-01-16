import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { GradientBackground, Card, Avatar } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';
import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

export const HomeScreen = ({ navigation }: any) => {
    const user = useAuthStore(state => state.user);
    const { couple, partner, stats, isLoading, fetchCoupleInfo, fetchCoupleStats } = useCoupleStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await Promise.all([
            fetchCoupleInfo(),
            fetchCoupleStats()
        ]);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const getTimeTogether = () => {
        if (!couple?.startDate) return { years: 0, months: 0, days: 0 };
        const start = new Date(couple.startDate);
        const now = new Date();

        const years = differenceInYears(now, start);
        const totalMonths = differenceInMonths(now, start);
        const months = totalMonths % 12;
        const totalDays = differenceInDays(now, start);

        return {
            years,
            months,
            days: totalDays,
        };
    };

    const time = getTimeTogether();

    if (isLoading && !couple) {
        return (
            <GradientBackground variant="background">
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground variant="background">
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.coupleHeader}>
                        <Avatar uri={user?.photoUrl} name={user?.name} size={60} />
                        <View style={styles.heartContainer}>
                            <Text style={styles.heart}>❤️</Text>
                        </View>
                        <Avatar uri={partner?.photoUrl} name={partner?.name} size={60} />
                    </View>
                    {couple?.coupleTag && (
                        <Text style={styles.coupleTag}>{couple.coupleTag}</Text>
                    )}
                </View>

                {/* Time Together */}
                <Card variant="glass" padding="large" style={styles.timeCard}>
                    <Text style={styles.cardTitle}>Time Together</Text>
                    <View style={styles.timeContainer}>
                        <TimeBlock value={time.years} label="Years" />
                        <TimeBlock value={time.months} label="Months" />
                        <TimeBlock value={time.days} label="Days" />
                    </View>
                </Card>

                {/* Quick Stats */}
                <View style={styles.statsGrid}>
                    <StatCard
                        icon="💬"
                        value={stats?.totalMessages || 0}
                        label="Messages"
                    />
                    <StatCard
                        icon="❓"
                        value={stats?.questionsAnswered || 0}
                        label="Questions"
                    />
                    <StatCard
                        icon="🎮"
                        value={stats?.gamesPlayed || 0}
                        label="Games"
                    />
                    <StatCard
                        icon="📅"
                        value={stats?.daysUntilAnniversary || 0}
                        label="Days to Anniversary"
                    />
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <ActionCard
                        icon="💬"
                        title="Chat"
                        onPress={() => navigation.navigate('Chat')}
                    />
                    <ActionCard
                        icon="❓"
                        title="Questions"
                        onPress={() => navigation.navigate('Questions')}
                    />
                    <ActionCard
                        icon="🎮"
                        title="Games"
                        onPress={() => navigation.navigate('Games')}
                    />
                    <ActionCard
                        icon="👤"
                        title="Profile"
                        onPress={() => navigation.navigate('Profile')}
                    />
                </View>
            </ScrollView>
        </GradientBackground>
    );
};

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <View style={styles.timeBlock}>
        <Text style={styles.timeValue}>{value}</Text>
        <Text style={styles.timeLabel}>{label}</Text>
    </View>
);

const StatCard = ({ icon, value, label }: { icon: string; value: number; label: string }) => (
    <Card variant="glass" padding="medium" style={styles.statCard}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </Card>
);

const ActionCard = ({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Card variant="glass" padding="medium" style={styles.actionCard}>
            <Text style={styles.actionIcon}>{icon}</Text>
            <Text style={styles.actionTitle}>{title}</Text>
        </Card>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: THEME.spacing.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: COLORS.white,
        fontSize: THEME.fontSizes.md,
        marginTop: THEME.spacing.md,
    },
    header: {
        alignItems: 'center',
        marginTop: THEME.spacing.xl,
        marginBottom: THEME.spacing.xl,
    },
    coupleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: THEME.spacing.md,
        marginBottom: THEME.spacing.md,
    },
    heartContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heart: {
        fontSize: 32,
    },
    coupleTag: {
        fontSize: THEME.fontSizes.xxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.primary,
    },
    timeCard: {
        marginBottom: THEME.spacing.lg,
    },
    cardTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        marginBottom: THEME.spacing.md,
        textAlign: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    timeBlock: {
        alignItems: 'center',
    },
    timeValue: {
        fontSize: THEME.fontSizes.xxxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.primary,
    },
    timeLabel: {
        fontSize: THEME.fontSizes.sm,
        color: COLORS.textSecondary,
        marginTop: THEME.spacing.xs,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: THEME.spacing.md,
        marginBottom: THEME.spacing.lg,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 32,
        marginBottom: THEME.spacing.xs,
    },
    statValue: {
        fontSize: THEME.fontSizes.xxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
        marginBottom: THEME.spacing.xs,
    },
    statLabel: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        marginBottom: THEME.spacing.md,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: THEME.spacing.md,
        marginBottom: THEME.spacing.xl,
    },
    actionCard: {
        width: (THEME.SCREEN_WIDTH - THEME.spacing.lg * 2 - THEME.spacing.md) / 2,
        alignItems: 'center',
        paddingVertical: THEME.spacing.lg,
    },
    actionIcon: {
        fontSize: 48,
        marginBottom: THEME.spacing.sm,
    },
    actionTitle: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
    },
});
