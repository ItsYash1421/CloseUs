import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Card } from '../common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import questionService, { DailyQuestionResponse } from '../../services/questionService';
import { useNavigation } from '@react-navigation/native';
import { QuestionSkeleton } from '../loaders';

interface DailyQuestionCardProps {
    data: DailyQuestionResponse | null;
    loading: boolean;
    onRefresh: () => void;
    showFullContent?: boolean; // If true, shows partner answer too (for Questions Screen)
}

export const DailyQuestionCard = ({ data, loading, onRefresh, showFullContent = false }: DailyQuestionCardProps) => {
    const navigation = useNavigation();
    const [answering, setAnswering] = useState(false);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitAnswer = async () => {
        if (!answerText.trim() || !data?.question?.id) return;

        try {
            setSubmitting(true);
            await questionService.answerQuestion(data.question.id, answerText);
            setAnswerText('');
            setAnswering(false);
            Alert.alert('Success', 'Answer submitted!');
            onRefresh(); // Refresh parent data
        } catch (error) {
            Alert.alert('Error', 'Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePress = () => {
        // If on Home screen (showFullContent=false), navigate to Questions screen on press
        if (!showFullContent) {
            // navigation.navigate('Questions' as never);
            // Actually, if we are in "Answering" mode, we might want to stay
        }
    };

    return (
        <Card variant="glass" padding="large" style={styles.dailyCard}>
            <View style={styles.headerRow}>
                <View style={styles.dailyBadge}>
                    <Text style={styles.dailyBadgeText}>Today's Question</Text>
                </View>
                {!showFullContent && (
                    <TouchableOpacity onPress={() => navigation.navigate('Questions' as never)}>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <QuestionSkeleton />
            ) : data ? (
                <>
                    <Text style={styles.dailyQuestion}>
                        {data.question.text}
                    </Text>

                    {data.myAnswer ? (
                        <View style={styles.answerContainer}>
                            <Text style={styles.answerLabel}>Your Answer:</Text>
                            <Text style={styles.answerText}>{data.myAnswer.text}</Text>

                            {/* Only show partner answer if requested (e.g. on full screen) */}
                            {showFullContent && (
                                <>
                                    <View style={[styles.statDivider, { marginVertical: 10 }]} />

                                    {data.partnerAnswer ? (
                                        <View>
                                            <Text style={styles.answerLabel}>Partner's Answer:</Text>
                                            <Text style={styles.answerText}>{data.partnerAnswer.text}</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.waitingText}>Waiting for partner to answer...</Text>
                                    )}
                                </>
                            )}

                            {!showFullContent && data.partnerAnswer && (
                                <Text style={styles.partnerAnswerHint}>
                                    ❤️ Partner has also answered! Tap to see.
                                </Text>
                            )}
                            {!showFullContent && !data.partnerAnswer && (
                                <Text style={styles.partnerAnswerHint}>
                                    ⏳ Waiting for partner...
                                </Text>
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
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSubmitAnswer}
                                    disabled={submitting || !answerText.trim()}
                                    style={[styles.actionButton, styles.submitButton]}
                                >
                                    <Text style={styles.buttonText}>{submitting ? 'Sending...' : 'Send'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.answerButton}
                            onPress={() => setAnswering(true)}
                        >
                            <Text style={styles.answerButtonText}>Answer Now →</Text>
                        </TouchableOpacity>
                    )}
                </>
            ) : (
                <Text style={styles.errorText}>Could not load today's question.</Text>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    dailyCard: {
        marginBottom: THEME.spacing.lg,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    dailyBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.xs,
        borderRadius: THEME.borderRadius.full,
        alignSelf: 'flex-start',
    },
    dailyBadgeText: {
        fontSize: THEME.fontSizes.xs,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
    },
    seeAllText: {
        color: COLORS.textSecondary,
        fontSize: THEME.fontSizes.sm,
    },
    dailyQuestion: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        lineHeight: 28,
        marginBottom: THEME.spacing.lg,
    },
    answerButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
        alignItems: 'center',
    },
    answerButtonText: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
    },
    statDivider: {
        width: 1,
        backgroundColor: COLORS.border,
    },
    answerContainer: {
        marginTop: THEME.spacing.sm,
    },
    answerLabel: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.textSecondary,
        marginBottom: 4,
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
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: THEME.fontSizes.sm,
    },
    errorText: {
        color: COLORS.error,
        textAlign: 'center',
    }
});
