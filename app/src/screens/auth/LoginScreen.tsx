import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { GradientBackground, Button } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';

export const LoginScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const login = useAuthStore(state => state.login);
    const user = useAuthStore(state => state.user);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await login();

            // Get updated user after login
            const loggedInUser = useAuthStore.getState().user;

            // Navigate based on onboarding status
            if (!loggedInUser?.isOnboardingComplete) {
                // New user - go to onboarding
                navigation.replace('PersonalInfo');
            } else if (!loggedInUser?.coupleId) {
                // Onboarded but not paired
                navigation.replace('CreateKey');
            } else {
                // Fully set up user - go to main app
                navigation.replace('MainTabs');
            }
        } catch (error: any) {
            setLoading(false);
            Alert.alert('Login Failed', error.message || 'Please try again');
        }
    };

    return (
        <GradientBackground variant="background">
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.logo}>❤️</Text>
                    <Text style={styles.title}>Sign In</Text>
                    <Text style={styles.subtitle}>
                        Continue with your Google account to get started
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Continue with Google"
                        onPress={handleGoogleSignIn}
                        variant="primary"
                        size="large"
                        fullWidth
                        loading={loading}
                    />
                    <Button
                        title="Go Back"
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                        size="medium"
                        fullWidth
                    />
                </View>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: THEME.spacing.xl,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        fontSize: 100,
        marginBottom: THEME.spacing.xl,
    },
    title: {
        fontSize: THEME.fontSizes.xxxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: THEME.spacing.md,
    },
    subtitle: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        gap: THEME.spacing.md,
    },
});
