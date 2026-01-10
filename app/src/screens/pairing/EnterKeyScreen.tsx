import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import { GradientBackground, Button, Input } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useCoupleStore } from '../../store/coupleStore';

export const EnterKeyScreen = ({ navigation }: any) => {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const pairWithPartner = useCoupleStore(state => state.pairWithPartner);

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
            return true; // Prevent default back behavior
        });

        return () => backHandler.remove();
    }, []);

    const handlePair = async () => {
        if (key.length !== 6) {
            Alert.alert('Invalid Key', 'Pairing key must be 6 characters');
            return;
        }

        try {
            setLoading(true);
            await pairWithPartner(key.toUpperCase());
            navigation.navigate('PairingSuccess');
        } catch (error: any) {
            setLoading(false);
            Alert.alert('Pairing Failed', error.message || 'Invalid or expired key');
        }
    };

    const handleDevPair = async () => {
        try {
            setLoading(true);
            await useCoupleStore.getState().devPair();
            // Navigate directly to MainTabs with reset
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error: any) {
            setLoading(false);
            Alert.alert('Dev Pairing Failed', error.message);
        }
    };

    return (
        <GradientBackground variant="background">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Enter Pairing Key</Text>
                    <Text style={styles.subtitle}>Got a key from your partner?</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>🔐</Text>
                    </View>

                    <Input
                        label="Pairing Key"
                        placeholder="XXXXXX"
                        value={key}
                        onChangeText={text => setKey(text.toUpperCase())}
                        maxLength={6}
                        autoCapitalize="characters"
                        style={styles.input}
                    />

                    <Text style={styles.hint}>
                        💡 Ask your partner to create a pairing key and share it with you
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Pair Now"
                        onPress={handlePair}
                        variant="primary"
                        size="large"
                        fullWidth
                        loading={loading}
                        disabled={key.length !== 6}
                    />
                    <Button
                        title="Create Key Instead"
                        onPress={() => navigation.navigate('CreateKey')}
                        variant="outline"
                        size="medium"
                        fullWidth
                    />
                    {/* Dev Mode Only */}
                    <Button
                        title="[DEV] Pair with Dummy Partner"
                        onPress={handleDevPair}
                        variant="secondary"
                        size="small"
                        fullWidth
                        loading={loading}
                    />
                </View>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: THEME.spacing.xl,
    },
    header: {
        marginTop: THEME.spacing.xxl,
        marginBottom: THEME.spacing.xl,
    },
    title: {
        fontSize: THEME.fontSizes.xxxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
        marginBottom: THEME.spacing.sm,
    },
    subtitle: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.textSecondary,
    },
    content: {
        flex: 1,
    },
    iconContainer: {
        alignSelf: 'center',
        marginBottom: THEME.spacing.xl,
    },
    icon: {
        fontSize: 80,
    },
    input: {
        textAlign: 'center',
        fontSize: THEME.fontSizes.xxl,
        letterSpacing: 8,
        fontWeight: THEME.fontWeights.bold,
    },
    hint: {
        fontSize: THEME.fontSizes.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: THEME.spacing.lg,
        lineHeight: 20,
    },
    footer: {
        paddingBottom: THEME.spacing.lg,
        gap: THEME.spacing.sm,
    },
});
