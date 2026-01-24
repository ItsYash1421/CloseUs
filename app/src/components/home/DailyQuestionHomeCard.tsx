import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { DailyQuestionResponse } from '../../services/questionService';
import { QuestionSkeleton } from '../loaders';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';

interface DailyQuestionHomeCardProps {
    data: DailyQuestionResponse | null;
    loading: boolean;
}

export const DailyQuestionHomeCard = ({
    data,
    loading,
}: DailyQuestionHomeCardProps) => {
    const navigation = useNavigation();
    const user = useAuthStore(state => state.user);
    const partner = useCoupleStore(state => state.partner);
    const [timeRemaining, setTimeRemaining] = useState('');
    const [revealed, setRevealed] = useState(false);

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-20)).current;

    const calculateTimeRemaining = () => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);

        const diff = midnight.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    useEffect(() => {
        setTimeRemaining(calculateTimeRemaining());
        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const handlePress = () => {
        navigation.navigate('Games' as never);
    };

    const revealAnswer = () => {
        setRevealed(true);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const getUserAvatar = () => {
        return user?.gender === 'male'
            ? require('../../assets/images/Logo-Male-2.png')
            : require('../../assets/images/Logo-Female-2.png');
    };

    const getPartnerAvatar = () => {
        return partner?.gender === 'male'
            ? require('../../assets/images/Logo-Male-2.png')
            : require('../../assets/images/Logo-Female-2.png');
    };

    if (loading) {
        return <QuestionSkeleton />;
    }

    if (!data) return null;

    return (
        <View style={styles.wrapper}>
            {/* Logo on Top Center Border */}
            <View style={styles.logoTopContainer}>
                <View style={styles.logoWrapper}>
                    <Image
                        source={require('../../assets/images/Logo-Ask-Question.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>
            </View>

            {/* Timer Badge - Floating on Top Right Border */}
            <View style={styles.timerBadge}>
                <Text style={styles.timerText}>{timeRemaining}</Text>
            </View>

            <TouchableOpacity
                activeOpacity={0.9}
                onPress={handlePress}
                disabled={!!data.myAnswer}
                style={styles.container}
            >
                <View style={styles.mainContent}>
                    {/* Daily Squeeze Badge - Left Aligned */}
                    <View style={styles.dailyBadge}>
                        <Text style={styles.dailyBadgeText}>DAILY SQUEEZE</Text>
                    </View>

                    {/* Question & Arrow Row */}
                    <View style={styles.questionRow}>
                        <Text style={styles.questionText}>
                            {data.question.text}
                        </Text>

                        {/* Right Arrow Circle - Only show if NOT answered */}
                        {!data.myAnswer && (
                            <View style={styles.arrowCircle}>
                                <Icon name="chevron-right" size={24} color={COLORS.white} />
                            </View>
                        )}
                    </View>

                    {/* Answer Display */}
                    {data.myAnswer && (
                        <View style={styles.answersSection}>
                            {/* My Answer */}
                            <View style={styles.answerRow}>
                                <Image source={getUserAvatar()} style={styles.answerAvatar} />
                                <Text style={styles.answerText} numberOfLines={1}>
                                    {data.myAnswer.text}
                                </Text>
                            </View>

                            {/* Partner Answer */}
                            <View style={styles.answerRow}>
                                <Image source={getPartnerAvatar()} style={styles.answerAvatar} />
                                {data.partnerAnswer ? (
                                    revealed ? (
                                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }], flex: 1 }}>
                                            <Text style={styles.answerText} numberOfLines={1}>{data.partnerAnswer.text}</Text>
                                        </Animated.View>
                                    ) : (
                                        <TouchableOpacity onPress={revealAnswer} style={{ flex: 1 }}>
                                            <Text style={styles.partnerHint}>Tap to see partner's answer</Text>
                                        </TouchableOpacity>
                                    )
                                ) : (
                                    <Text style={styles.waitingText}>Waiting for partner...</Text>
                                )}
                            </View>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: THEME.spacing.md,
        marginTop: 20, // Increased for bigger logo
        position: 'relative',
    },
    logoTopContainer: {
        position: 'absolute',
        top: -60, // Pull up by half height
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 20,
        pointerEvents: 'none',
    },
    logoWrapper: {
        width: 120, // Bigger Logo
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    timerBadge: {
        position: 'absolute',
        top: -10,
        right: 16,
        backgroundColor: '#1A1A2E',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        zIndex: 25,
    },
    timerText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.white,
        letterSpacing: 0.3,
    },
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 20,
        paddingBottom: 24,
        paddingTop: 35, // Space for logo body
        minHeight: 160,
    },
    mainContent: {
        flex: 1,
        width: '100%',
    },
    dailyBadge: {
        backgroundColor: '#1A1A2E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 8,
        alignSelf: 'flex-start', // Left aligned
    },
    dailyBadgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: COLORS.white,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    questionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        width: '100%',
    },
    questionText: {
        flex: 1,
        fontSize: 18, // Slightly larger for emphasis
        fontWeight: '700',
        color: COLORS.white,
        lineHeight: 26,
        textAlign: 'left', // Left aligned
    },
    arrowCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    answersSection: {
        marginTop: 16,
        gap: 8,
        width: '100%',
    },
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        paddingVertical: 10,
        borderRadius: 14,
    },
    answerAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    answerText: {
        fontSize: 13,
        color: COLORS.white,
        flex: 1,
        lineHeight: 18,
    },
    partnerHint: {
        fontSize: 13,
        color: COLORS.primary,
        fontStyle: 'italic',
    },
    waitingText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
});
