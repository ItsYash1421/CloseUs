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

                <TouchableOpacity style={styles.closeButtonWrapper} onPress={handleClose}>
                    <BlurView
                        style={StyleSheet.absoluteFill}
                        blurType={BLUR_CONFIG.blurType}
                        blurAmount={BLUR_CONFIG.blurAmount}
                        reducedTransparencyFallbackColor={BLUR_CONFIG.fallbackColor}
                    />
                    <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16 }} />
                    <Icon name="close" size={20} color="#FFFFFF" style={{ zIndex: 1 }} />
                </TouchableOpacity>

                <View style={styles.categoryBadgeWrapper}>
                    <BlurView
                        style={StyleSheet.absoluteFill}
                        blurType={BLUR_CONFIG.blurType}
                        blurAmount={BLUR_CONFIG.blurAmount}
                        reducedTransparencyFallbackColor={BLUR_CONFIG.fallbackColor}
                    />
                    <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16 }} />
                    <Text style={styles.categoryBadgeText}>
                        {categoryName}
                    </Text>
                </View>
            </View>

            {/* Content Card */}
            <View style={styles.contentCard}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Spinner size="large" color={COLORS.primary} />
                    </View>
                ) : data ? (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.title}>Question</Text>
                        <Text style={styles.questionText}>{data.question.text}</Text>
                        <View style={styles.divider} />

                        {/* Answers Section */}
                        <Animated.View style={[styles.answersContainer, { opacity: fadeAnim }]}>
                            <Text style={styles.answersTitle}>Answers</Text>

                            {/* User Answer */}
                            <View style={styles.answerCard}>
                                <View style={styles.answerHeader}>
                                    <Image source={getUserAvatar()} style={styles.avatar} />
                                    <Text style={styles.answerName}>{user?.name || 'You'}</Text>
                                </View>
                                {data.userAnswer ? (
                                    <Text style={styles.answerText}>{data.userAnswer.answer}</Text>
                                ) : (
                                    <Text style={styles.waitingText}>No answer yet</Text>
                                )}
                            </View>

                            {/* Partner Answer */}
                            <View style={styles.answerCard}>
                                <View style={styles.answerHeader}>
                                    <Image source={getPartnerAvatar()} style={styles.avatar} />
                                    <Text style={styles.answerName}>{partner?.name || 'Partner'}</Text>
                                </View>
                                {data.partnerAnswer ? (
                                    <Text style={styles.answerText}>{data.partnerAnswer.answer}</Text>
                                ) : (
                                    <Text style={styles.waitingText}>⏳ Waiting for partner...</Text>
                                )}
                            </View>
                        </Animated.View>
                    </ScrollView>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: THEME.spacing.xl,
        paddingTop: 40,
        paddingBottom: 40,
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
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 20,
        lineHeight: 28,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 24,
    },
    answersContainer: {
        gap: 16,
    },
    answersTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
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
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    answerText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        lineHeight: 24,
    },
    waitingText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontStyle: 'italic',
    },
});
