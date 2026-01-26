import React, { useState, useEffect } from 'react';
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

    const handleClose = () => {
        navigation.goBack();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.container}>
                    {/* Top Section with GIF */}
                    <View style={styles.topSection}>
                        {/* Using same GIF style as EnterKeyScreen for consistency */}
                        <FastImage
                            source={require('../../assets/gifs/EnterKey.gif')}
                            style={styles.gifImage}
                            resizeMode={FastImage.resizeMode.cover}
                        />

                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>

                        {/* Category Pill on top of Image */}
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{categoryEmoji} {categoryName}</Text>
                        </View>
                    </View>

                    <Toast />

                    {/* Content Card with Bottom Sheet effect */}
                    <View style={styles.contentCard}>
                        {/* Question Title */}
                        <Text style={styles.title}>
                            Question
                        </Text>

                        {/* Question Text */}
                        <Text style={styles.questionText}>
                            {text}
                        </Text>

                        <View style={styles.divider} />

                        {/* Answer Input */}
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
                            />
                        </View>

                        {/* Submit Button */}
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
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topSection: {
        height: '45%',
        width: '100%',
        position: 'relative',
        backgroundColor: '#FFFFFF',
    },
    gifImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 50, // Adjusted for status bar area safe zone approx
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    categoryBadge: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    categoryBadgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    contentCard: {
        flex: 1,
        backgroundColor: '#1A0E2E', // Dark purple theme
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: THEME.spacing.xl,
        paddingTop: 40,
        paddingBottom: 30,
        marginTop: -32, // Negative margin for overlap effect
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary, // Accent color
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    questionText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 24,
        lineHeight: 32,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        color: '#B8B8D1',
        marginBottom: 12,
    },
    inputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 30, // Space before button
        minHeight: 120,
    },
    input: {
        fontSize: 16,
        color: '#FFFFFF',
        height: '100%', // Take full container height
    },
    submitButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        paddingVertical: 18,
        alignItems: 'center',
        width: '100%',
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
