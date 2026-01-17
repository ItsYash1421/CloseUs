import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import questionService, { DailyQuestionResponse } from '../../services/questionService';
import { useNavigation } from '@react-navigation/native';
import { QuestionSkeleton } from '../loaders';

interface DailyQuestionCardProps {
    data: DailyQuestionResponse | null;
    loading: boolean;
    onRefresh: () => void;
    showFullContent?: boolean;
}

export const DailyQuestionCard = ({ data, loading, onRefresh, showFullContent = false }: DailyQuestionCardProps) => {
    const navigation = useNavigation();
    const [answering, setAnswering] = useState(false);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');

    // Calculate time remaining until midnight
    const calculateTimeRemaining = () => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);

        const diff = midnight.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    // Update timer every minute
    React.useEffect(() => {
        setTimeRemaining(calculateTimeRemaining());
        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const handleSubmitAnswer = async () => {
        if (!answerText.trim() || !data?.question?.id) return;

        try {
            setSubmitting(true);
            await questionService.answerQuestion(data.question.id, answerText);
            setAnswerText('');
            setAnswering(false);
            Alert.alert('Success', 'Answer submitted!');
            onRefresh();
        } catch (error) {
            Alert.alert('Error', 'Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <QuestionSkeleton />;
    }

    return (
        <View style={styles.container}>
            {/* Logo on Top Border */}
            <View style={styles.logoTopContainer}>
                <View style={styles.logoWrapper}>
                    <Image
                        source={require('../../assets/images/Logo-Ask-Question.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>
            </View>

            {/* Card Content */}
            <View style={styles.card}>
                {/* Timer Badge - Only show if not answered */}
                {data && !data.myAnswer && (
                    <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>{timeRemaining}</Text>
                    </View>
                )}

                {/* Badge */}
                <View style={styles.dailyBadge}>
                    <Text style={styles.dailyBadgeText}>DAILY SQUEEZE</Text>
                </View>

                {data ? (
                    <>
                        <Text style={styles.dailyQuestion}>{data.question.text}</Text>

                        {data.myAnswer ? (
                            <View style={styles.answerContainer}>
                                <Text style={styles.answerLabel}>Your Answer:</Text>
                                <Text style={styles.answerText}>{data.myAnswer.text}</Text>

                                {showFullContent && (
                                    <>
                                        <View style={styles.divider} />
                                        {data.partnerAnswer ? (
                                            <View>
                                                <Text style={styles.answerLabel}>Partner's Answer:</Text>
                                                <Text style={styles.answerText}>{data.partnerAnswer.text}</Text>
                                            </View>
                                        ) : (
                                            <Text style={styles.waitingText}>⏳ Waiting for partner...</Text>
                                        )}
                                    </>
                                )}

                                {!showFullContent && data.partnerAnswer && (
                                    <Text style={styles.partnerAnswerHint}>❤️ Partner answered! Tap to see.</Text>
                                )}
                                {!showFullContent && !data.partnerAnswer && (
                                    <Text style={styles.partnerAnswerHint}>⏳ Waiting for partner...</Text>
                                )}
                            </View>
                        ) : answering ? (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Type your answer..."
                                    placeholderTextColor={COLORS.textSecondary}
                                    multiline
                                    value={answerText}
                                    onChangeText={setAnswerText}
                                />
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        onPress={() => setAnswering(false)}
                                        style={[styles.actionButton, styles.cancelButton]}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleSubmitAnswer}
                                        disabled={submitting || !answerText.trim()}
                                        style={[styles.actionButton, styles.submitButton]}
                                    >
                                        <Text style={styles.submitButtonText}>{submitting ? 'Sending...' : 'Send'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.answerButton}
                                onPress={() => setAnswering(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.answerButtonText}>Answer Now</Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <Text style={styles.errorText}>Could not load today's question.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: -50,
        marginBottom: THEME.spacing.lg,
        position: 'relative',
    },
    logoTopContainer: {
        alignItems: 'center',
        marginBottom: -90,
        zIndex: 10,
    },
    logoWrapper: {
        width: 180,
        height: 180,
        backgroundColor: 'transparent',
        borderRadius: 20,
        padding: 16,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: THEME.spacing.lg,
        paddingTop: 60,
        position: 'relative',
    },
    timerBadge: {
        position: 'absolute',
        top: -12,
        right:10,
        backgroundColor: '#1A1A2E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    timerText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.white,
        letterSpacing: 0.3,
    },
    dailyBadge: {
        backgroundColor: '#1A1A2E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignSelf: 'flex-start',
        marginBottom: THEME.spacing.md,
    },
    dailyBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    dailyQuestion: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
        lineHeight: 26,
        marginBottom: THEME.spacing.lg,
    },
    answerButton: {
        backgroundColor: COLORS.white,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    answerButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.black,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: THEME.spacing.md,
    },
    answerContainer: {
        marginTop: THEME.spacing.sm,
    },
    answerLabel: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.textSecondary,
        marginBottom: 6,
        fontWeight: '600',
    },
    answerText: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.white,
        lineHeight: 22,
    },
    waitingText: {
        fontSize: THEME.fontSizes.sm,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        marginTop: 5,
    },
    partnerAnswerHint: {
        fontSize: THEME.fontSizes.sm,
        color: COLORS.textSecondary,
        marginTop: 10,
        fontStyle: 'italic',
    },
    inputContainer: {
        marginTop: 10,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: THEME.borderRadius.md,
        padding: 12,
        color: COLORS.white,
        fontSize: THEME.fontSizes.md,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    actionButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    submitButton: {
        backgroundColor: COLORS.white,
    },
    cancelButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: THEME.fontSizes.sm,
    },
    submitButtonText: {
        color: COLORS.black,
        fontWeight: '700',
        fontSize: THEME.fontSizes.sm,
    },
    errorText: {
        color: COLORS.error,
        textAlign: 'center',
        fontSize: THEME.fontSizes.md,
    }
});
