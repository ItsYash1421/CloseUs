import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  Animated,
} from 'react-native';
import { GradientBackground } from '../../components/common';
import { DailyQuestionCard, StickyHeader } from '../../components/home';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import gamesService, { GameCategory } from '../../services/gamesService';
import questionService, { DailyQuestionResponse } from '../../services/questionService';
import { GamesHeader } from '../../components/games/GamesHeader';
import { TrendingGames } from '../../components/games/TrendingGames';
import { GamesGrid } from '../../components/games/GamesGrid';
import { GamesStats } from '../../components/games/GamesStats';

const { width } = Dimensions.get('window');

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const GamesScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefresh, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Daily Question State
  const [questionData, setQuestionData] = useState<DailyQuestionResponse | null>(null);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Scroll & Keyboard Handling
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const currentScrollY = useRef(0);
  const restoreScrollY = useRef(0);

  useEffect(() => {
    loadData();
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onKeyboardShow = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardVisible(true);
    };

    const onKeyboardHide = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardVisible(false);
      // Restore scroll position after keyboard dismiss
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            y: 0, // Always scroll to top since Daily Question is the only input and it's at the top
            animated: true, // Animated true for smooth restoration
          });
        }
      }, 100);
    };

    const keyboardShowListener = Keyboard.addListener(showEvent, onKeyboardShow);
    const keyboardHideListener = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const handleInputFocus = () => {
    restoreScrollY.current = currentScrollY.current;
  };

  const loadData = async (isRefreshAction = false) => {
    try {
      if (!isRefreshAction) setIsLoading(true);
      setError(null);

      // Load both games and daily question
      const [gamesData, dailyQData] = await Promise.all([
        gamesService.getCategories(),
        questionService.getDailyQuestion().catch(err => {
          console.error('Failed to load daily question:', err);
          return null;
        })
      ]);

      setCategories(gamesData);
      if (dailyQData) setQuestionData(dailyQData);

    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load games');
      Alert.alert('Error', 'Failed to load content. Please try again.');
    } finally {
      setIsLoading(false);
      setQuestionLoading(false);
      if (isRefreshAction) setIsRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData(true);
  }, []);

  // Refresh only daily question (for after answering)
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

  // Loading State
  if (isLoading) {
    return (
      <GradientBackground variant="background">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading games...</Text>
        </View>
      </GradientBackground>
    );
  }

  // Error State
  if (error && categories.length === 0) {
    return (
      <GradientBackground variant="background">
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😔</Text>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadData()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  // Empty State
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
    .sort((a, b) => b.timesPlayed - a.timesPlayed)
    .slice(0, 5); // Sort by plays (descending) and take top 5

  const activeCategories = categories.filter((c) => c.isActive);

  // Check if daily question is completed by both
  const isDailyQuestionCompleted = questionData?.myAnswer && questionData?.partnerAnswer;

  return (
    <GradientBackground
      variant="background"
      scrollY={scrollY}
      scrollInputRange={[0, 300]}
    >
      {/* Sticky Header - Hide when keyboard is visible */}
      {!isKeyboardVisible && (
        <StickyHeader hashtag="Games Hub" scrollY={scrollY} />
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Animated.ScrollView
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={isKeyboardVisible ? styles.containerFocused : { paddingBottom: THEME.spacing.xl }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false, // Changed to false if using layout properties, or strictly keep true if only opacity/transform
              listener: (event: any) => {
                currentScrollY.current = event.nativeEvent.contentOffset.y;
              },
            }
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
          {/* Header - New Component */}
          {!isKeyboardVisible && <GamesHeader />}

          {/* Daily Question Card - Only show if NOT completed by both */}
          {!isDailyQuestionCompleted && (
            <View style={styles.dailyQuestionContainer}>
              <DailyQuestionCard
                data={questionData}
                loading={questionLoading}
                onRefresh={refreshDailyQuestion}
                showFullContent={false}
                onInputFocus={handleInputFocus}
              />
            </View>
          )}

          {/* Other Content - Hide when keyboard is visible */}
          {!isKeyboardVisible && (
            <>
              {/* Trending Games */}
              {trendingCategories.length > 0 && (
                <TrendingGames
                  games={trendingCategories}
                  onGamePress={handleGamePress}
                />
              )}

              {/* All Games */}
              <GamesGrid
                games={categories}
                onGamePress={handleGamePress}
              />

              {/* Quote Section */}
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteText}>
                  "Love is not just looking at each other, it's looking in the same direction... and playing together!"
                </Text>
              </View>

              {/* Bottom Spacer */}
              <View style={{ height: 100 }} />
            </>
          )}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  containerFocused: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 250, // Significant padding to push content up from keyboard
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
