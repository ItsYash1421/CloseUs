import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image, Keyboard, Animated } from 'react-native';
import { GradientBackground } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { validateDate, validateName } from '../../validations/onboardingValidation';
import { useOnboardingStore } from '../../store/onboardingStore';

export const PersonalInfoScreen = ({ navigation }: any) => {
    const gender = useOnboardingStore(state => state.gender);
    const setPersonalInfo = useOnboardingStore(state => state.setPersonalInfo);

    // Load existing data from store
    const storeName = useOnboardingStore(state => state.name);
    const storeDob = useOnboardingStore(state => state.dob);
    const storePhotoUrl = useOnboardingStore(state => state.photoUrl);

    const [name, setName] = useState(storeName || '');
    const [photoUri, setPhotoUri] = useState<string | undefined>(storePhotoUrl || undefined);

    // Parse DOB if exists
    const existingDob = storeDob ? new Date(storeDob) : null;
    const [day, setDay] = useState(existingDob ? existingDob.getDate().toString().padStart(2, '0') : '');
    const [month, setMonth] = useState(existingDob ? (existingDob.getMonth() + 1).toString().padStart(2, '0') : '');
    const [year, setYear] = useState(existingDob ? existingDob.getFullYear().toString() : '');

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [focusedInput, setFocusedInput] = useState<'name' | 'date' | null>(null);

    // Animated values for smooth transitions
    const avatarOpacity = useRef(new Animated.Value(1)).current;
    const nameOpacity = useRef(new Animated.Value(1)).current;
    const dateOpacity = useRef(new Animated.Value(1)).current;
    const nameTranslateY = useRef(new Animated.Value(0)).current;
    const dateTranslateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                setFocusedInput(null);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    // Animate avatar based on keyboard state
    useEffect(() => {
        const duration = 250;
        if (isKeyboardVisible) {
            Animated.timing(avatarOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(avatarOpacity, {
                toValue: 1,
                duration,
                useNativeDriver: true,
            }).start();
        }
    }, [isKeyboardVisible]);

    // Animate inputs based on focus state - runs immediately on focus change
    useEffect(() => {
        const duration = 250;

        if (focusedInput === 'name') {
            // Show name input and move it up
            Animated.parallel([
                Animated.timing(nameOpacity, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true
                }),
                Animated.timing(nameTranslateY, {
                    toValue: -50,
                    duration,
                    useNativeDriver: true
                }),
                // Hide date input
                Animated.timing(dateOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true
                }),
                Animated.timing(dateTranslateY, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true
                }),
            ]).start();
        } else if (focusedInput === 'date') {
            // Hide name input
            Animated.parallel([
                Animated.timing(nameOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true
                }),
                Animated.timing(nameTranslateY, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true
                }),
                // Show date input and move it up
                Animated.timing(dateOpacity, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true
                }),
                Animated.timing(dateTranslateY, {
                    toValue: -130,
                    duration,
                    useNativeDriver: true
                }),
            ]).start();
        } else {
            // No input focused - reset all to visible
            Animated.parallel([
                Animated.timing(nameOpacity, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true
                }),
                Animated.timing(nameTranslateY, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true
                }),
                Animated.timing(dateOpacity, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true
                }),
                Animated.timing(dateTranslateY, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true
                }),
            ]).start();
        }
    }, [focusedInput]);

    const handlePickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (result.assets && result.assets[0].uri) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleContinue = () => {
        // Validate name
        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Name',
                text2: nameValidation.error,
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        // Validate date
        const dateValidation = validateDate(day, month, year);
        if (!dateValidation.isValid) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Date',
                text2: dateValidation.error,
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        const dob = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);

        // Save to onboarding store (instant, no API call)
        setPersonalInfo(name, dob, photoUri);

        // Navigate instantly
        navigation.navigate('RelationshipStatus');
    };

    const handleDayChange = (text: string) => {
        if (text.length <= 2 && /^\d*$/.test(text)) {
            setDay(text);
        }
    };

    const handleMonthChange = (text: string) => {
        if (text.length <= 2 && /^\d*$/.test(text)) {
            setMonth(text);
        }
    };

    const handleYearChange = (text: string) => {
        if (text.length <= 4 && /^\d*$/.test(text)) {
            setYear(text);
        }
    };

    // Get gender-specific avatar
    const getGenderAvatar = () => {
        if (photoUri) {
            return { uri: photoUri };
        }
        if (gender === 'male') {
            return require('../../assets/images/Logo-Male.png');
        }
        if (gender === 'female') {
            return require('../../assets/images/Logo-Female.png');
        }
        return null;
    };

    const avatarSource = getGenderAvatar();

    return (
        <GradientBackground variant="background">
            <Toast />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}>

                {/* Progress Bar - Fixed */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '40%' }]} />
                    </View>
                </View>

                {/* Header - Fixed */}
                <View style={styles.header}>
                    <Text style={styles.title}>Tell us about yourself</Text>
                    <Text style={styles.subtitle}>Let's get to know you better</Text>
                </View>

                {/* Scrollable Content */}
                <View style={styles.content}>
                    {/* Avatar - Always rendered, just hidden */}
                    <Animated.View style={[styles.avatarContainer, { opacity: avatarOpacity }]}>
                        <TouchableOpacity onPress={handlePickImage} disabled={isKeyboardVisible}>
                            {avatarSource ? (
                                <Image source={avatarSource} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarPlaceholderText}>?</Text>
                                </View>
                            )}
                            <View style={styles.editBadge}>
                                <Text style={styles.editIcon}>+</Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Name Input - Smooth show/hide with position */}
                    <Animated.View
                        style={[
                            styles.inputContainer,
                            {
                                opacity: nameOpacity,
                                transform: [{ translateY: nameTranslateY }]
                            }
                        ]}
                        pointerEvents={isKeyboardVisible && focusedInput !== 'name' ? 'none' : 'auto'}>
                        <Text style={styles.inputLabel}>Your Name</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your name"
                            placeholderTextColor={COLORS.textMuted}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            onFocus={() => setFocusedInput('name')}
                            onBlur={() => setFocusedInput(null)}
                        />
                    </Animated.View>

                    {/* Date Input - Smooth show/hide with position */}
                    <Animated.View
                        style={[
                            styles.inputContainer,
                            {
                                opacity: dateOpacity,
                                transform: [{ translateY: dateTranslateY }]
                            }
                        ]}
                        pointerEvents={isKeyboardVisible && focusedInput !== 'date' ? 'none' : 'auto'}>
                        <Text style={styles.inputLabel}>Date of Birth</Text>
                        <View style={styles.dateInputContainer}>
                            <View style={styles.dateBox}>
                                <TextInput
                                    style={styles.dateInput}
                                    placeholder="DD"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={day}
                                    onChangeText={handleDayChange}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    onFocus={() => setFocusedInput('date')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>
                            <View style={styles.dateBox}>
                                <TextInput
                                    style={styles.dateInput}
                                    placeholder="MM"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={month}
                                    onChangeText={handleMonthChange}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    onFocus={() => setFocusedInput('date')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>
                            <View style={styles.dateBoxYear}>
                                <TextInput
                                    style={styles.dateInput}
                                    placeholder="YYYY"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={year}
                                    onChangeText={handleYearChange}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    onFocus={() => setFocusedInput('date')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>
                        </View>
                    </Animated.View>
                </View>

                {/* Footer - Hidden immediately when any input focused */}
                {!focusedInput && !isKeyboardVisible && (
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.nextButton, (!name || !day || !month || !year) && styles.nextButtonDisabled]}
                            onPress={handleContinue}
                            disabled={!name || !day || !month || !year}
                            activeOpacity={0.8}>
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: THEME.spacing.xl,
    },
    progressContainer: {
        marginTop: THEME.spacing.md,
        marginBottom: THEME.spacing.lg,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 2,
    },
    header: {
        marginBottom: THEME.spacing.xl,
    },
    title: {
        fontSize: THEME.fontSizes.xxxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: THEME.spacing.sm,
    },
    subtitle: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: THEME.spacing.xxl,
        position: 'relative',
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        fontSize: 48,
        color: COLORS.white,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    editIcon: {
        fontSize: 20,
        fontWeight: THEME.fontWeights.bold,
        color: '#1F1F1F',
    },
    inputContainer: {
        marginBottom: THEME.spacing.lg,
    },
    inputLabel: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        marginBottom: THEME.spacing.sm,
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: THEME.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: THEME.spacing.md,
        fontSize: THEME.fontSizes.md,
        color: COLORS.white,
    },
    dateInputContainer: {
        flexDirection: 'row',
        gap: THEME.spacing.sm,
    },
    dateBox: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: THEME.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: THEME.spacing.md,
    },
    dateBoxYear: {
        flex: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: THEME.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: THEME.spacing.md,
    },
    dateInput: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.white,
        textAlign: 'center',
    },
    footer: {
        paddingBottom: THEME.spacing.lg,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: THEME.spacing.sm,
        paddingHorizontal: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        height: 48,
    },
    nextButtonDisabled: {
        opacity: 0.5,
    },
    nextButtonText: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
        color: '#1F1F1F',
    },
});
