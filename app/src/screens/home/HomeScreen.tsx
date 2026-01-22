import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Animated, Keyboard } from 'react-native';
import { GradientBackground, Card, Avatar } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';
import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { BOTTOM_CONTENT_INSET } from '../../constants/layout';
import { CoupleHeader, StickyHeader, OurJourney, ChatSection, DailyQuestionCard } from '../../components/home';
import { HomeSkeleton } from '../../components/loaders';
import questionService, { DailyQuestionResponse } from '../../services/questionService';

export const HomeScreen = ({ navigation }: any) => {
    const user = useAuthStore(state => state.user);
    const { couple, partner, stats, isLoading, partnerIsOnline, fetchCoupleInfo, fetchCoupleStats } = useCoupleStore();
    const [refreshing, setRefreshing] = useState(false);
    const [questionData, setQuestionData] = useState<DailyQuestionResponse | null>(null);
    const [questionLoading, setQuestionLoading] = useState(true);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isScreenLoading, setIsScreenLoading] = useState(true);

    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const currentScrollY = useRef(0);
    const restoreScrollY = useRef(0);

    console.log('HomeScreen - partnerIsOnline:', partnerIsOnline);

    useEffect(() => {
        loadData();
    }, []);

    // Continuously track scroll position
    useEffect(() => {
        const listenerId = scrollY.addListener(({ value }) => {
            currentScrollY.current = value;
        });
        return () => {
            scrollY.removeListener(listenerId);
        };
    }, [scrollY]);

    const handleInputFocus = () => {
        // Snapshot scroll position IMMEDIATELY when user focuses input
        // This is safe because layout hasn't changed yet
        restoreScrollY.current = currentScrollY.current;
    };

    // Listen for keyboard behavior
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                // Restore after delay to allow layout to fully expand
                setTimeout(() => {
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollTo({
                            y: restoreScrollY.current,
                            animated: false,
                        });
                    }
                }, 100);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const loadData = async () => {
        // Enforce minimum 2 second loading delay for shimmer effect
        const minDelay = new Promise(resolve => setTimeout(() => resolve(true), 2000));

        const dataPromises = Promise.all([
            fetchCoupleInfo(),
            fetchCoupleStats(),
            fetchDailyQuestion()
        ]);

        await Promise.all([minDelay, dataPromises]);
        setIsScreenLoading(false);
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
        // Also show shimmer on pull-to-refresh if desired, or just standard refresher
        // User asked for "always 2 sec", maybe mostly for initial load. 
        // For refresh usually spinner is better, but let's stick to standard behavior for refresh unless specified.
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

    return (
        <GradientBackground
            variant="background"
            scrollY={scrollY}
            scrollInputRange={[0, 300]} // Fully dark after 300px scroll
        >
            {/* Sticky Header - Hide when keyboard is open */}
            {!isKeyboardVisible && (
                <StickyHeader
                    hashtag={couple?.coupleTag}
                    scrollY={scrollY}
                />
            )}

            <Animated.ScrollView
                ref={scrollViewRef}
                keyboardShouldPersistTaps="handled"
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
                {/* Couple Header - Hide when typing */}
                {!isKeyboardVisible && (
                    <CoupleHeader
                        userName={user?.name}
                        partnerName={partner?.name}
                        coupleHashtag={couple?.coupleTag}
                        userAvatar={user?.photoUrl}
                        partnerAvatar={partner?.photoUrl}
                        isOnline={true}
                    />
                )}

                {/* Loading State - Show Skeleton BELOW Header */}
                {(isScreenLoading || (isLoading && !couple)) ? (
                    <HomeSkeleton />
                ) : (
                    /* Content with padding */
                    <View style={[styles.contentPadding, { gap: THEME.spacing.xl, marginTop: isKeyboardVisible ? 60 : THEME.spacing.xl }]}>
                        {/* Chat Section & Our Journey - Hide when typing */}
                        {!isKeyboardVisible && (
                            <>
                                <ChatSection
                                    onOpenChat={() => navigation.navigate('Chat')}
                                    partnerName={partner?.name || 'Partner'}
                                    isOnline={partnerIsOnline}
                                    userGender={user?.gender}
                                />

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
                            </>
                        )}

                        {/* Daily Question - ALWAYS VISIBLE */}
                        <View>
                            <DailyQuestionCard
                                data={questionData}
                                loading={questionLoading}
                                onRefresh={fetchDailyQuestion}
                                showFullContent={false}
                                onInputFocus={handleInputFocus}
                            />
                        </View>

                        {/* Quote - Hide when typing */}
                        {!isKeyboardVisible && (
                            <View style={styles.quoteContainer}>
                                <Text style={styles.quoteText}>
                                    "Every moment with you is a beautiful memory in the making.
                                    Love isn't just about being together, it's about growing together."
                                </Text>
                            </View>
                        )}
                    </View>
                )}
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
        marginVertical: 0,
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
