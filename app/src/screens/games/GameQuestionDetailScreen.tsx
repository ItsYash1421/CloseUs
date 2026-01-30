import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { Spinner } from '../../components/common';
import gamesService from '../../services/gamesService';
import THEME from '../../constants/theme';
import { COLORS } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { BlurView } from '@react-native-community/blur';
import { BLUR_CONFIG } from '../../constants/blur';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useKeyboardAnimation } from '../../hooks/useKeyboardAnimation';

type GameQuestionDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'GameQuestionDetail'
>;
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'GameQuestionDetail'
>;

export const GameQuestionDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<GameQuestionDetailScreenRouteProp>();
  const { questionId, text, categoryName, categoryEmoji } = route.params;

  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Empty Answer',
        text2: 'Please type your answer first',
        position: 'top',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Save answer via API
      await gamesService.saveAnswer(questionId, answer.trim());
      // Dismiss keyboard immediately
      Keyboard.dismiss();

      Toast.show({
        type: 'success',
        text1: 'Answer Saved!',
        text2: 'Your answer has been recorded',
        position: 'top',
      });

      // Go back to questions list after short delay
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to save',
        text2: 'Please try again later',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animated values from custom hook
  const { translateY, imageOpacity, imageScale, buttonOpacity, buttonScale } =
    useKeyboardAnimation();

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <Animated.View style={[{ flex: 1 }, { transform: [{ translateY }] }]}>
            {/* Top Section */}
            <View style={styles.topSection}>
              <Animated.View
                style={{
                  flex: 1,
                  opacity: imageOpacity,
                  transform: [{ scale: imageScale }],
                }}
              >
                <FastImage
                  source={require('../../assets/gifs/EnterKey.gif')}
                  style={styles.gifImage}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </Animated.View>

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
                <Icon
                  name="close"
                  size={20}
                  color="#FFFFFF"
                  style={{ zIndex: 1 }}
                />
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
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.title}>Question</Text>
                <Text style={styles.questionText}>{text}</Text>
                <View style={styles.divider} />
                <Text style={styles.inputLabel}>Your Answer</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder="Type your answer here..."
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    onFocus={() => {
                      // Optional: extra trigger for focus effects
                    }}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={true}
                  />
                </View>

                <Animated.View
                  style={{
                    opacity: buttonOpacity,
                    transform: [{ scale: buttonScale }],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      isLoading && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner size="small" color="#000000" />
                    ) : (
                      <Text style={styles.submitButtonText}>Submit Answer</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </ScrollView>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0E2E',
  },
  topSection: {
    height: '40%', // Fixed ratio
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#1A0E2E',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: 40,
    paddingBottom: 20, // Reduced padding
    flexGrow: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 22, // Slightly smaller for better fit
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
    lineHeight: 28,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#B8B8D1',
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 12,
    minHeight: 80,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 60,
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
    marginBottom: 0,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});
