import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GradientBackground, Card } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import gamesService, { GameQuestion } from '../../services/gamesService';
import { RootStackParamList } from '../../types';

type CategoryQuestionsScreenRouteProp = RouteProp<
  RootStackParamList,
  'CategoryQuestions'
>;
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'CategoryQuestions'
>;

export const CategoryQuestionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CategoryQuestionsScreenRouteProp>();
  const { categoryId, categoryName, categoryEmoji, categoryColor } =
    route.params;

  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch questions and answered IDs in parallel
      const [questionsData, answersData] = await Promise.all([
        gamesService.getQuestionsByCategory(categoryId),
        gamesService.getUserAnswers(),
      ]);

      setQuestions(questionsData.questions);
      setAnsweredQuestionIds(answersData.answeredQuestionIds);
    } catch (error) {
      console.error('Failed to load questions:', error);
      Alert.alert('Error', 'Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionPress = (question: GameQuestion) => {
    // Check if question is already answered
    const isAnswered = answeredQuestionIds.includes(question._id);

    if (isAnswered) {
      Alert.alert(
        'Already Answered',
        'You\'ve already answered this question!',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('GameQuestionDetail', {
      questionId: question._id,
      text: question.text,
      categoryName,
      categoryEmoji,
      categoryColor,
    });
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerEmoji}>{categoryEmoji}</Text>
            <Text style={styles.headerTitle}>{categoryName}</Text>
          </View>
        </View>

        {/* Questions List */}
        <FlatList
          data={questions}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const isAnswered = answeredQuestionIds.includes(item._id);

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleQuestionPress(item)}
                disabled={isAnswered}
              >
                <Card
                  variant="glass"
                  padding="medium"
                  style={[
                    styles.questionCard,
                    isAnswered && styles.answeredCard,
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.questionNumberBadge}>
                      <Text style={styles.questionNumberText}>#{index + 1}</Text>
                    </View>
                    {isAnswered ? (
                      <View style={styles.answeredBadge}>
                        <Text style={styles.answeredText}>✓ Answered</Text>
                      </View>
                    ) : item.timesPlayed > 0 ? (
                      <Text style={styles.playedCount}>
                        Played {item.timesPlayed}x
                      </Text>
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.questionText,
                      isAnswered && styles.answeredText
                    ]}
                    numberOfLines={2}
                  >
                    {item.text}
                  </Text>
                  {!isAnswered && (
                    <Text style={styles.tapToPlay}>Tap to play →</Text>
                  )}
                </Card>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No questions found.</Text>
            </View>
          }
        />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Status bar formatting
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
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2,
  },
  headerEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 40,
    gap: THEME.spacing.md,
  },
  questionCard: {
    marginBottom: THEME.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  questionNumberBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  questionNumberText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  playedCount: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  questionText: {
    fontSize: THEME.fontSizes.md,
    color: COLORS.white,
    fontWeight: THEME.fontWeights.medium,
    lineHeight: 22,
    marginBottom: THEME.spacing.md,
  },
  tapToPlay: {
    fontSize: THEME.fontSizes.sm,
    color: COLORS.primary,
    fontWeight: THEME.fontWeights.bold,
    textAlign: 'right',
  },
  emptyContainer: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: THEME.fontSizes.md,
  },
  answeredCard: {
    opacity: 0.5,
  },
  answeredBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  answeredText: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
