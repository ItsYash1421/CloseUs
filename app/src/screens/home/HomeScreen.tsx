import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Animated } from 'react-native';
import { GradientBackground, Card, Avatar } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';
import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { BOTTOM_CONTENT_INSET } from '../../constants/layout';
import { CoupleHeader, StickyHeader, OurJourney, ChatSection, DailyQuestionCard } from '../../components/home';
import questionService, { DailyQuestionResponse } from '../../services/questionService';

export const HomeScreen = ({ navigation }: any) => {
    const user = useAuthStore(state => state.user);
    const { couple, partner, stats, isLoading, partnerIsOnline, fetchCoupleInfo, fetchCoupleStats } = useCoupleStore();
    const [refreshing, setRefreshing] = useState(false);
    const [questionData, setQuestionData] = useState<DailyQuestionResponse | null>(null);
    const [questionLoading, setQuestionLoading] = useState(true);

    const scrollY = useRef(new Animated.Value(0)).current;

    console.log('HomeScreen - partnerIsOnline:', partnerIsOnline);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await Promise.all([
            fetchCoupleInfo(),
            fetchCoupleStats(),
            fetchDailyQuestion()
        ]);
    };

    const fetchDailyQuestion = async () => {
        try {
            setQuestionLoading(true);
            const data = await questionService.getDailyQuestion();
            setQuestionData(data);
        } catch (error) {
            console.error('Fetch daily question error:', error);
        } finally {
            setQuestionLoading(false);
        }
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
            {/* Sticky Header */}
            <StickyHeader
                hashtag={couple?.coupleTag}
                scrollY={scrollY}
            />

            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: BOTTOM_CONTENT_INSET }}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* New Couple Header */}
                <CoupleHeader
                    userName={user?.name}
                    partnerName={partner?.name}
                    coupleHashtag={couple?.coupleTag}
                    userAvatar={user?.photoUrl}
                    partnerAvatar={partner?.photoUrl}
                    isOnline={true}
                />

                {/* Content with padding */}
                <View style={[styles.contentPadding, { gap: THEME.spacing.xl, marginTop: THEME.spacing.xl }]}>
                    {/* Chat Section - New */}
                    <ChatSection
                        onOpenChat={() => navigation.navigate('Chat')}
                        partnerName={partner?.name || 'Partner'}
                        isOnline={partnerIsOnline}
                        userGender={user?.gender}
                    />

                    {/* Our Journey */}
                    <View>
                        <OurJourney
                            currentDays={stats?.milestone?.current || time.days}
                            nextMilestone={stats?.milestone?.next || 100}
                            progress={stats?.milestone?.progress || 0}
                            onViewHistory={() => {
                                navigation.navigate('Journey');
                            }}
                        />
                    </View>

                    {/* Daily Question */}
                    <View>
                        <DailyQuestionCard
                            data={questionData}
                            loading={questionLoading}
                            onRefresh={fetchDailyQuestion}
                            showFullContent={false}
                        />
                    </View>

                    {/* Inspirational Quote */}
                    <View style={styles.quoteContainer}>
                        <Text style={styles.quoteText}>
                            "Every moment with you is a beautiful memory in the making.
                            Love isn't just about being together, it's about growing together."
                        </Text>
                    </View>
                </View>
            </Animated.ScrollView>
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
    contentPadding: {
        paddingHorizontal: THEME.spacing.lg,
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
    quoteContainer: {
        marginVertical:0,
        paddingHorizontal: THEME.spacing.md,
    },
    quoteText: {
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: '400',
        letterSpacing: 0.3,
    },
});
