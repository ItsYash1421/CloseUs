import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GradientBackground, Button } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useCoupleStore } from '../../store/coupleStore';

export const PairingSuccessScreen = ({ navigation }: any) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const couple = useCoupleStore(state => state.couple);

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 10,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleContinue = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    };

    return (
        <GradientBackground variant="purple">
            <View style={styles.container}>
                <View style={styles.content}>
                    <Animated.View
                        style={[
                            styles.iconContainer,
                            {
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}>
                        <Text style={styles.icon}>🎉</Text>
                    </Animated.View>

                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Text style={styles.title}>You're Paired!</Text>
                        <Text style={styles.subtitle}>
                            Welcome to your private space together
                        </Text>

                        {couple?.coupleTag && (
                            <View style={styles.tagContainer}>
                                <Text style={styles.tagLabel}>Your Couple Tag</Text>
                                <Text style={styles.tag}>{couple.coupleTag}</Text>
                            </View>
                        )}

                        <View style={styles.features}>
                            <FeatureItem icon="💬" text="Private Chat" />
                            <FeatureItem icon="❓" text="Daily Questions" />
                            <FeatureItem icon="🎮" text="Couple Games" />
                            <FeatureItem icon="📊" text="Relationship Stats" />
                        </View>
                    </Animated.View>
                </View>

                <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                    <Button
                        title="Let's Get Started!"
                        onPress={handleContinue}
                        variant="primary"
                        size="large"
                        fullWidth
                    />
                </Animated.View>
            </View>
        </GradientBackground>
    );
};

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
    <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <Text style={styles.featureText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: THEME.spacing.xl,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: THEME.spacing.xl,
    },
    icon: {
        fontSize: 120,
    },
    title: {
        fontSize: THEME.fontSizes.huge,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: THEME.spacing.sm,
    },
    subtitle: {
        fontSize: THEME.fontSizes.lg,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: THEME.spacing.xl,
    },
    tagContainer: {
        alignItems: 'center',
        marginBottom: THEME.spacing.xxl,
    },
    tagLabel: {
        fontSize: THEME.fontSizes.sm,
        color: COLORS.textSecondary,
        marginBottom: THEME.spacing.xs,
    },
    tag: {
        fontSize: THEME.fontSizes.xxxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.primary,
    },
    features: {
        gap: THEME.spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: THEME.spacing.md,
    },
    featureIcon: {
        fontSize: 24,
    },
    featureText: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.white,
        fontWeight: THEME.fontWeights.medium,
    },
    footer: {
        paddingBottom: THEME.spacing.lg,
    },
});
