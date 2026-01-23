import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { GradientBackground, Card } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import gamesService, { GameQuestion } from '../../services/gamesService';

interface CategoryQuestionsScreenProps {
    route: {
        params: {
            categoryId: string;
            categoryName: string;
            categoryEmoji: string;
            categoryColor: string;
        };
    };
    navigation: any;
}

export const CategoryQuestionsScreen: React.FC<CategoryQuestionsScreenProps> = ({
    route,
    navigation,
}) => {
    const { categoryId, categoryName, categoryEmoji, categoryColor } = route.params;
    const [questions, setQuestions] = useState<GameQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, [categoryId]);

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const data = await gamesService.getQuestionsByCategory(categoryId);
            setQuestions(data.questions);
        } catch (error) {
            console.error('Failed to load questions:', error);
            Alert.alert('Error', 'Failed to load questions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <GradientBackground variant="background">
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading questions...</Text>
                </View>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground variant="background">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
                    <Text style={styles.title}>{categoryName}</Text>
                    <Text style={styles.subtitle}>
                        {questions.length} Questions Available
                    </Text>
                </View>

                {/* Questions List */}
                <View style={styles.questionsList}>
                    {questions.map((question, index) => (
                        <Card
                            key={question._id}
                            variant="glass"
                            padding="large"
                            style={styles.questionCard}
                        >
                            <View style={styles.questionHeader}>
                                <Text style={styles.questionNumber}>#{index + 1}</Text>
                                {question.timesPlayed > 0 && (
                                    <View style={styles.playedBadge}>
                                        <Text style={styles.playedText}>
                                            Played {question.timesPlayed}x
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <Text style={styles.questionText}>{question.text}</Text>
                        </Card>
                    ))}
                </View>

                {/* Empty State */}
                {questions.length === 0 && (
                    <Card variant="glass" padding="large" style={styles.emptyCard}>
                        <Text style={styles.emptyEmoji}>🎮</Text>
                        <Text style={styles.emptyText}>No questions available yet</Text>
                        <Text style={styles.emptySubtext}>
                            Check back later for new questions!
                        </Text>
                    </Card>
                )}
            </ScrollView>
        </GradientBackground>
    );
};

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
        color: COLORS.textSecondary,
        marginTop: THEME.spacing.md,
        fontSize: THEME.fontSizes.md,
    },
    header: {
        marginTop: THEME.spacing.xl,
        marginBottom: THEME.spacing.xl,
        alignItems: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: THEME.spacing.lg,
    },
    backText: {
        color: COLORS.primary,
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
    },
    categoryEmoji: {
        fontSize: 80,
        marginBottom: THEME.spacing.md,
    },
    title: {
        fontSize: THEME.fontSizes.xxxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
        marginBottom: THEME.spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    questionsList: {
        gap: THEME.spacing.md,
        marginBottom: THEME.spacing.xl,
    },
    questionCard: {
        position: 'relative',
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.sm,
    },
    questionNumber: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.primary,
    },
    playedBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: THEME.spacing.sm,
        paddingVertical: 4,
        borderRadius: THEME.borderRadius.sm,
    },
    playedText: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.white,
        fontWeight: THEME.fontWeights.medium,
    },
    questionText: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.white,
        lineHeight: 24,
    },
    emptyCard: {
        alignItems: 'center',
        padding: THEME.spacing.xxl,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: THEME.spacing.md,
    },
    emptyText: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        marginBottom: THEME.spacing.xs,
    },
    emptySubtext: {
        fontSize: THEME.fontSizes.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});
