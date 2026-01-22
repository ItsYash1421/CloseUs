import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { GradientBackground, Card, Header } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import questionService, {
  DailyQuestionResponse,
} from '../../services/questionService';

const CATEGORIES = [
  { id: '1', name: 'Getting to Know You', emoji: '👋', count: 50 },
  { id: '2', name: 'Deep Conversations', emoji: '💭', count: 45 },
  { id: '3', name: 'Fun & Playful', emoji: '🎉', count: 40 },
  { id: '4', name: 'Future Together', emoji: '🔮', count: 35 },
  { id: '5', name: 'Memories', emoji: '📸', count: 30 },
  { id: '6', name: 'Love & Romance', emoji: '💕', count: 42 },
];

export const QuestionsScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState<DailyQuestionResponse | null>(
    null,
  );
  const [answering, setAnswering] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDailyQuestion();
  }, []);

  const fetchDailyQuestion = async () => {
    try {
      setLoading(true);
      const data = await questionService.getDailyQuestion();
      setDailyData(data);
    } catch (error) {
      console.error('Fetch daily question error:', error);
      // Fallback or error state could be handled here
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !dailyData?.question?.id) return;

    try {
      setSubmitting(true);
      await questionService.answerQuestion(dailyData.question.id, answerText);
      setAnswerText('');
      setAnswering(false);
      // Refresh to see updated state
      await fetchDailyQuestion();
      Alert.alert('Success', 'Answer submitted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GradientBackground variant="background">
      <Header title="Daily Questions" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Answer questions together and learn more about each other
          </Text>
        </View>

        {/* Daily Question */}
        <Card variant="glass" padding="large" style={styles.dailyCard}>
          <View style={styles.dailyBadge}>
            <Text style={styles.dailyBadgeText}>Today's Question</Text>
          </View>

          {loading ? (
            <ActivityIndicator
              color={COLORS.primary}
              style={{ marginVertical: 20 }}
            />
          ) : dailyData ? (
            <>
              <Text style={styles.dailyQuestion}>
                {dailyData.question.text}
              </Text>

              {/* Logic: 
                                1. If I answered -> Show my answer
                                2. If I haven't -> Show Answer Button (or Input)
                             */}

              {dailyData.myAnswer ? (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerLabel}>Your Answer:</Text>
                  <Text style={styles.answerText}>
                    {dailyData.myAnswer.text}
                  </Text>

                  <View style={[styles.statDivider, { marginVertical: 10 }]} />

                  {dailyData.partnerAnswer ? (
                    <View>
                      <Text style={styles.answerLabel}>Partner's Answer:</Text>
                      <Text style={styles.answerText}>
                        {dailyData.partnerAnswer.text}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.waitingText}>
                      Waiting for partner to answer...
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
                      <Text style={styles.buttonText}>
                        {submitting ? 'Sending...' : 'Send'}
                      </Text>
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
            <Text style={styles.errorText}>
              Could not load today's question.
            </Text>
          )}
        </Card>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map(category => (
            <TouchableOpacity key={category.id} activeOpacity={0.8}>
              <Card
                variant="glass"
                padding="medium"
                style={styles.categoryCard}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>
                  {category.count} questions
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <Card variant="glass" padding="medium" style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Answered</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>180</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  header: {
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.xl,
  },
  title: {
    fontSize: THEME.fontSizes.xxxl,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: THEME.fontSizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  dailyCard: {
    marginBottom: THEME.spacing.xl,
  },
  // Styles for categories...
  sectionTitle: {
    fontSize: THEME.fontSizes.lg,
    fontWeight: THEME.fontWeights.semibold,
    color: COLORS.white,
    marginBottom: THEME.spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
  },
  categoryCard: {
    width: (THEME.SCREEN_WIDTH - THEME.spacing.lg * 2 - THEME.spacing.md) / 2,
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 40,
    marginBottom: THEME.spacing.sm,
  },
  categoryName: {
    fontSize: THEME.fontSizes.sm,
    fontWeight: THEME.fontWeights.semibold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: THEME.spacing.xs,
  },
  categoryCount: {
    fontSize: THEME.fontSizes.xs,
    color: COLORS.textSecondary,
  },
  statsCard: {
    marginBottom: THEME.spacing.xl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: THEME.fontSizes.xxl,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.primary,
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.fontSizes.xs,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
});
