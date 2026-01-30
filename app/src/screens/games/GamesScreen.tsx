import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
  Animated,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GradientBackground } from '../../components/common';
import { DailyQuestionCard, StickyHeader } from '../../components/home';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import gamesService, { GameCategory } from '../../services/gamesService';
import questionService, {
  DailyQuestionResponse,
} from '../../services/questionService';
import { GamesHeader } from '../../components/games/GamesHeader';
import { TrendingGames } from '../../components/games/TrendingGames';
import { GamesGrid } from '../../components/games/GamesGrid';
import { GamesStats } from '../../components/games/GamesStats';
import { GamesSkeleton } from '../../components/loaders';
import { useKeyboardAnimation } from '../../hooks/useKeyboardAnimation';

const { width } = Dimensions.get('window');

export const GamesScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefresh, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Daily Question State
  const [questionData, setQuestionData] =
    useState<DailyQuestionResponse | null>(null);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Scroll Handling
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const currentScrollY = useRef(0);
  const restoreScrollY = useRef(0);

  // Custom Animation Hook
  const { translateY, imageOpacity } = useKeyboardAnimation({
    translateYValue: -50,
  });

  // Track if this is the initial load to prevent white flash on focus
  const isInitialLoad = useRef(true);

  useEffect(() => {
    loadData(true);
  }, []);

  // Auto-refresh when screen comes into focus (after user completes question)
  useFocusEffect(
    useCallback(() => {
      // Skip refresh on initial mount (already handled by useEffect)
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      // Refresh game categories to update counts and status - SILENTLY
      console.log('[GamesScreen] Screen focused, refreshing data silently...');
      loadData(false);
    }, []),
  );

  // Keyboard listeners for state
  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = () => {
      setKeyboardVisible(true);
    };

    const onHide = () => {
      setKeyboardVisible(false);
    };

    const sub1 = Keyboard.addListener(showEvent, onShow);
    const sub2 = Keyboard.addListener(hideEvent, onHide);

    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  const handleInputFocus = () => {
    restoreScrollY.current = currentScrollY.current;
    // Scroll to top to ensure daily question is in view
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const loadData = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      setError(null);

      const [gamesData, dailyQData] = await Promise.all([
        gamesService.getCategories(),
        questionService.getDailyQuestion().catch(err => {
          console.error('Failed to load daily question:', err);
          return null;
        }),
      ]);

      setCategories(gamesData);
      if (dailyQData) setQuestionData(dailyQData);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load games');
      Alert.alert('Error', 'Failed to load content. Please try again.');
    } finally {
      if (showLoader) setIsLoading(false);
      setQuestionLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData(false); // Don't show main loader, usage of RefreshControl is handled by isRefresh state
  }, []);

  const refreshDailyQuestion = async () => {
    try {
      const data = await questionService.getDailyQuestion();
      setQuestionData(data);
    } catch (error) {
      console.error('Failed to refresh daily question:', error);
    }
  };

  const handleGamePress = (category: GameCategory) => {
    if (!category.isActive) {
      Alert.alert('Coming Soon', 'This game will be available soon!');
      return;
    }

    if (category.questionCount === 0) {
      Alert.alert('No Questions', 'This category has no questions yet.');
      return;
    }

    navigation.navigate('CategoryQuestions', {
      categoryId: category._id,
      categoryName: category.name,
      categoryEmoji: category.emoji,
      categoryColor: category.color,
    });
  };

  if (isLoading) {
    return (
      <GradientBackground variant="background">
        <GamesSkeleton />
      </GradientBackground>
    );
  }

  if (error && categories.length === 0) {
    return (
      <GradientBackground variant="background">
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😔</Text>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadData()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  if (categories.length === 0) {
    return (
      <GradientBackground variant="background">
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎮</Text>
          <Text style={styles.emptyTitle}>No Games Yet</Text>
          <Text style={styles.emptyMessage}>
            Games will appear here soon. Check back later!
          </Text>
        </View>
      </GradientBackground>
    );
  }

  const trendingCategories = [...categories]
    .filter(c => c.isActive)
    .sort((a, b) => (b.totalPlayed || 0) - (a.totalPlayed || 0))
    .slice(0, 5);

  const activeCategories = categories.filter(c => c.isActive);

  const isDailyQuestionCompleted =
    questionData?.myAnswer && questionData?.partnerAnswer;

  return (
    <GradientBackground
      variant="background"
      scrollY={scrollY}
      scrollInputRange={[0, 300]}
    >
      {/* Sticky Header */}
      <Animated.View style={{ opacity: imageOpacity, zIndex: 10 }}>
        {!isKeyboardVisible && (
          <StickyHeader hashtag="Games Hub" scrollY={scrollY} />
        )}
      </Animated.View>

      {/* Main content with smooth animations - no KeyboardAvoidingView needed */}
      <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
        <Animated.ScrollView
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={{ paddingBottom: THEME.spacing.xl }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false,
              listener: (event: any) => {
                currentScrollY.current = event.nativeEvent.contentOffset.y;
              },
            },
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        >
          {/* Header */}
          <Animated.View style={{ opacity: imageOpacity }}>
            <GamesHeader />
          </Animated.View>

          {/* Daily Question Card */}
          {!isDailyQuestionCompleted && (
            <View style={styles.dailyQuestionContainer}>
              <DailyQuestionCard
                data={questionData}
                loading={questionLoading}
                onRefresh={refreshDailyQuestion}
                showFullContent={false}
                onInputFocus={handleInputFocus}
                isKeyboardVisible={isKeyboardVisible}
              />
            </View>
          )}

          {/* Other Content */}
          <Animated.View style={{ opacity: imageOpacity }}>
            {trendingCategories.length > 0 && (
              <TrendingGames
                games={trendingCategories}
                onGamePress={handleGamePress}
                onShowAll={() => navigation.navigate('AllGames')}
              />
            )}

            <GamesGrid games={categories} onGamePress={handleGamePress} />

            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>
                "Love is not just looking at each other, it's looking in the
                same direction... and playing together!"
              </Text>
            </View>

            <View style={{ height: 100 }} />
          </Animated.View>
        </Animated.ScrollView>
      </Animated.View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: THEME.spacing.md,
  },
  errorTitle: {
    fontSize: THEME.fontSizes.xxl,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
    marginBottom: THEME.spacing.sm,
  },
  errorMessage: {
    fontSize: THEME.fontSizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: THEME.fontSizes.md,
    fontWeight: THEME.fontWeights.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: THEME.spacing.md,
  },
  emptyTitle: {
    fontSize: THEME.fontSizes.xxl,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
    marginBottom: THEME.spacing.sm,
  },
  emptyMessage: {
    fontSize: THEME.fontSizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  dailyQuestionContainer: {
    marginBottom: 0,
    marginTop: 0,
    zIndex: 100,
    elevation: 100,
    position: 'relative',
  },
  quoteContainer: {
    marginVertical: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.xl,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '400',
    letterSpacing: 0.3,
    opacity: 0.8,
  },
});
