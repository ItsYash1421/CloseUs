import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    BackHandler,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Spinner } from '../../components/common';
import { useCoupleStore } from '../../store/coupleStore';
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';
import THEME from '../../constants/theme';
import { COLORS } from '../../constants/colors';
import { getErrorMessage } from '../../utils/errorHandler';

export const EnterKeyScreen = ({ navigation }: any) => {
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { pairWithPartner } = useCoupleStore();
    const user = useAuthStore(state => state.user);

    // Handle back button
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                'Exit App?',
                'Are you sure you want to quit the app?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Exit',
                        onPress: () => BackHandler.exitApp()
                    }
                ]
            );
            return true;
        });

        return () => backHandler.remove();
    }, []);

    const handleSubmit = async () => {
        if (key.length !== 6) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Key',
                text2: 'Please enter a 6-character code',
                position: 'top',
            });
            return;
        }

        try {
            setIsLoading(true);
            await pairWithPartner(key.toUpperCase());
            Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: 'Successfully paired with your partner',
                position: 'top',
            });
            setTimeout(() => {
                navigation.replace('PairingSuccess');
            }, 1000);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Pairing Failed',
                text2: getErrorMessage(error),
                position: 'top',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        navigation.navigate('CreateKey');
    };

    const handleDevPair = async () => {
        try {
            setIsLoading(true);
            await useCoupleStore.getState().devPair();
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Dev Pairing Failed',
                text2: getErrorMessage(error),
                position: 'top',
            });
        } finally {
            setIsLoading(false);
        }
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
                        <FastImage
                            source={require('../../assets/gifs/EnterKey.gif')}
                            style={styles.gifImage}
                            resizeMode={FastImage.resizeMode.cover}
                        />

                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <Toast />

                    {/* Content Card */}
                    <View style={styles.contentCard}>
                        {/* Title */}
                        <Text style={styles.title}>
                            Unlock your <Text style={styles.titleHighlight}>private</Text> space 💖
                        </Text>

                        {/* Subtitle */}
                        <Text style={styles.subtitle}>
                            Enter {user?.partnerName || 'partner'}'s key
                        </Text>

                        {/* Input Field */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.keyEmoji}>🔑</Text>
                            <TextInput
                                style={styles.input}
                                value={key}
                                onChangeText={(text) => setKey(text.toUpperCase())}
                                placeholder="Enter 6-char code"
                                placeholderTextColor="#B0B0B0"
                                maxLength={6}
                                autoCapitalize="characters"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Unlock Button */}
                        <TouchableOpacity
                            style={[styles.unlockButton, isLoading && styles.unlockButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Spinner size="small" color="#000000" />
                            ) : (
                                <Text style={styles.unlockButtonText}>
                                    Unlock Now
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Dev Mode Button */}
                        <TouchableOpacity
                            style={styles.devButton}
                            onPress={handleDevPair}
                            disabled={isLoading}
                        >
                            <Text style={styles.devButtonText}>
                                [DEV] Pair with Dummy Partner
                            </Text>
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
        backgroundColor: '#FFFFFF', // White background for GIF
    },
    gifImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent for visibility
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 24,
        color: '#FFFFFF', // White X on dark button
        fontWeight: '600',
    },
    contentCard: {
        flex: 1,
        backgroundColor: '#1A0E2E', // Dark purple from theme
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: THEME.spacing.xl,
        paddingTop: 40,
        paddingBottom: 50,
        marginTop: -32, // Overlap with top section for seamless look
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF', // White text on dark background
        textAlign: 'center',
        marginBottom: THEME.spacing.sm,
    },
    titleHighlight: {
        color: '#FF6B9D',
    },
    subtitle: {
        fontSize: THEME.fontSizes.md,
        color: '#B8B8D1',
        textAlign: 'center',
        marginBottom: THEME.spacing.xl,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 18,
        marginBottom: THEME.spacing.xl * 2,
    },
    keyEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: THEME.fontSizes.lg,
        color: '#FFFFFF',
        fontWeight: '600',
        letterSpacing: 2,
    },
    unlockButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        paddingVertical: 18,
        alignItems: 'center',
    },
    unlockButtonDisabled: {
        opacity: 0.6,
    },
    unlockButtonText: {
        fontSize: THEME.fontSizes.md,
        fontWeight: '600',
        color: '#000000',
    },
    devButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 28,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: THEME.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    devButtonText: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: '500',
        color: '#B8B8D1',
    },
});
