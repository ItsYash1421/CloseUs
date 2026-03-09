import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Spinner } from '../../components/common';
import gamesService, {
  QuestionWithAnswersResponse,
} from '../../services/gamesService';
import THEME from '../../constants/theme';
import { COLORS } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { FONTS } from '../../constants/text';
import { BlurView } from '@react-native-community/blur';
import { BLUR_CONFIG } from '../../constants/blur';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';

type GameQuestionAnswerRouteProp = RouteProp<
  RootStackParamList,
  'GameQuestionAnswer'
>;
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'GameQuestionAnswer'
>;

export const GameQuestionAnswerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<GameQuestionAnswerRouteProp>();
  const { questionId, categoryName, categoryEmoji, categoryColor } =
    route.params;

  // Store Data
  const user = useAuthStore(state => state.user);
  const partner = useCoupleStore(state => state.partner);

  // State
  const [data, setData] = useState<QuestionWithAnswersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchQuestionData();
  }, []);

  const fetchQuestionData = async () => {
    try {
      setIsLoading(true);
      const response = await gamesService.getQuestionWithAnswers(questionId);
      setData(response);

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Failed to fetch question data:', error);
      Alert.alert('Error', 'Failed to load answers. Please try again.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  // Get avatar based on gender
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

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Top Section with GIF */}
      <View style={styles.topSection}>
        <FastImage
          source={require('../../assets/gifs/EnterKey.gif')}
          style={styles.gifImage}
          resizeMode={FastImage.resizeMode.cover}
        />

        <TouchableOpacity
          style={styles.closeButtonWrapper}
          onPress={handleClose}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={BLUR_CONFIG.blurType}
            blurAmount={BLUR_CONFIG.blurAmount}
            reducedTransparencyFallbackColor={BLUR_CONFIG.fallbackColor}
          />
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 16,
            }}
          />
          <Icon name="close" size={20} color="#FFFFFF" style={{ zIndex: 1 }} />
        </TouchableOpacity>

        <View style={styles.categoryBadgeWrapper}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={BLUR_CONFIG.blurType}
            blurAmount={BLUR_CONFIG.blurAmount}
            reducedTransparencyFallbackColor={BLUR_CONFIG.fallbackColor}
          />
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 16,
            }}
          />
          <Text style={styles.categoryBadgeText}>{categoryName}</Text>
        </View>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Spinner size="large" color={COLORS.primary} />
          </View>
        ) : data ? (
          <>
            {/* Sticky Question Section */}
            <View style={styles.stickyQuestionContainer}>
              <Text style={styles.title}>Question</Text>
              <Text style={styles.questionText}>{data.question.text}</Text>
              <View style={styles.divider} />
            </View>

            {/* Scrollable Answers Section */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View
                style={[styles.answersContainer, { opacity: fadeAnim }]}
              >
                <Text style={styles.answersTitle}>Answers</Text>

                {/* User Answer */}
                <View style={styles.answerCard}>
                  <View style={styles.answerHeader}>
                    <Image source={getUserAvatar()} style={styles.avatar} />
                    <Text style={styles.answerName}>{user?.name || 'You'}</Text>
                  </View>
                  {data.userAnswer ? (
                    <Text style={styles.answerText}>
                      {data.userAnswer.answer}
                    </Text>
                  ) : (
                    <Text style={styles.waitingText}>No answer yet</Text>
                  )}
                </View>

                {/* Partner Answer */}
                <View style={styles.answerCard}>
                  <View style={styles.answerHeader}>
                    <Image source={getPartnerAvatar()} style={styles.avatar} />
                    <Text style={styles.answerName}>
                      {partner?.name || 'Partner'}
                    </Text>
                  </View>
                  {data.partnerAnswer ? (
                    <Text style={styles.answerText}>
                      {data.partnerAnswer.answer}
                    </Text>
                  ) : (
                    <Text style={styles.waitingText}>
                      ⏳ Waiting for partner...
                    </Text>
                  )}
                </View>
              </Animated.View>
            </ScrollView>
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0E2E',
  },
  topSection: {
    height: '40%',
    width: '100%',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  gifImage: {
    width: '100%',
    height: '100%',
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadgeWrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryBadgeText: {
    fontFamily: FONTS.hashtags,
    // ...TEXT_STYLES.hashtag,
    color: 'white',
    fontSize: 12,
    fontWeight: THEME.fontWeights.bold,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#1A0E2E',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyQuestionContainer: {
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: 24, // Reduced from 40
    paddingBottom: 0,
    backgroundColor: '#1A0E2E',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: 0,
    paddingBottom: 40,
  },
  title: {
    fontFamily: FONTS.hashtags,
    // ...TEXT_STYLES.hashtag,
    fontSize: 12, // Reduced from 14
    color: COLORS.primary,
    marginBottom: 4, // Reduced from 8
    letterSpacing: 1,
    fontWeight: THEME.fontWeights.bold,
    textTransform: 'uppercase',
  },
  questionText: {
    fontFamily: FONTS.questions,
    // ...TEXT_STYLES.questionBig,
    fontSize: 18, // Reduced from 22
    color: '#FFFFFF',
    marginBottom: 16, // Reduced from 20
    lineHeight: 24, // Reduced from 28
    fontWeight: THEME.fontWeights.bold,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16, // Reduced from 24
  },
  answersContainer: {
    gap: 16,
  },
  answersTitle: {
    fontFamily: FONTS.hashtags,
    // ...TEXT_STYLES.hashtag,
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 12,
    letterSpacing: 1,
    fontWeight: THEME.fontWeights.bold,
    textTransform: 'uppercase',
  },
  answerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 12,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  answerName: {
    fontFamily: FONTS.names,
    // ...TEXT_STYLES.name,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: THEME.fontWeights.semibold,
  },
  answerText: {
    fontFamily: FONTS.body,
    // ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },
  waitingText: {
    fontFamily: FONTS.body,
    // ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
