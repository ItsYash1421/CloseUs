import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Image, BackHandler, Alert, Share, Linking, InteractionManager } from 'react-native';
import FastImage from 'react-native-fast-image';
import { GradientBackground } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useCoupleStore } from '../../store/coupleStore';
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';
// SVG support temporarily disabled due to bundler issues

export const CreateKeyScreen = ({ navigation }: any) => {
    const { pairingKey, createPairingKey, refreshPairingKey, checkPairingStatus, pairingAttempts } = useCoupleStore();
    const user = useAuthStore(state => state.user);
    const pollingIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        // Use InteractionManager to wait for screen transition to complete
        const task = InteractionManager.runAfterInteractions(() => {
            if (!pairingKey) {
                createPairingKey();
            }
        });

        return () => task.cancel();
    }, []);

    // Polling: Check pairing status every 10 seconds
    useEffect(() => {
        // Prevent multiple intervals
        if (pollingIntervalRef.current) {
            return;
        }

        pollingIntervalRef.current = setInterval(async () => {
            console.log('Polling pairing status...');
            const isPaired = await checkPairingStatus();
            if (isPaired) {
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                Toast.show({
                    type: 'success',
                    text1: 'Paired!',
                    text2: 'Successfully paired with your partner',
                    position: 'top',
                });
                setTimeout(() => {
                    navigation.replace('PairingSuccess');
                }, 1000);
            }
        }, 10000); // 10 seconds

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, []);

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

    const handleCopy = () => {
        if (pairingKey) {
            Clipboard.setString(pairingKey);
            Toast.show({
                type: 'success',
                text1: 'Copied!',
                text2: 'Key copied to clipboard',
                position: 'top',
            });
        }
    };

    const handleRefresh = () => {
        refreshPairingKey();
        Toast.show({
            type: 'success',
            text1: 'New Key Generated',
            text2: 'Your pairing key has been refreshed',
            position: 'top',
        });
    };

    const handleShareKey = async () => {
        if (pairingKey) {
            try {
                await Share.share({
                    message: `Join me on CloseUs! Use this pairing key: ${pairingKey}`,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        }
    };

    const handleWhatsAppShare = () => {
        if (pairingKey) {
            const message = encodeURIComponent(`Join me on CloseUs! Use this pairing key: ${pairingKey}`);
            Linking.openURL(`whatsapp://send?text=${message}`);
        }
    };

    const handleInstagramShare = () => {
        Linking.openURL('instagram://');
    };

    const handleGotKey = () => {
        navigation.navigate('EnterKey');
    };

    return (
        <GradientBackground variant="background">
            <View style={styles.container}>
                {/* Main White Card */}
                <View style={styles.mainCard}>
                    {/* Info Text at Top of Card */}
                    <Text style={styles.infoText}>
                        Only one of you needs to enter the other's key - not both!
                    </Text>

                    {/* Title */}
                    <Text style={styles.title}>No Partner. No Party</Text>

                    {/* Key Display */}
                    <View style={styles.keySection}>
                        <Text style={styles.keyEmoji}>🔑</Text>
                        <Text style={styles.keyLabel}>Your secret key: </Text>
                        <Text style={styles.keyValue}>{pairingKey || 'XXXXXX'}</Text>
                        <TouchableOpacity onPress={handleCopy} style={styles.copyIcon}>
                            <Image
                                source={require('../../assets/images/Logo-CopyIcon.png')}
                                style={styles.iconImage}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Refresh Link */}
                    <TouchableOpacity onPress={handleRefresh} style={styles.refreshContainer}>
                        <Text style={styles.refreshText}>Refresh here</Text>
                    </TouchableOpacity>

                    <Text style={styles.attemptsText}>Tell {user?.partnerName || 'your partner'} to enter the key!</Text>

                    {/* GIF Image */}
                    <View style={styles.gifContainer}>
                        <FastImage
                            source={require('../../assets/gifs/CreateKey.gif')}
                            style={styles.gif}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>

                    {/* Share Buttons */}
                    <View style={styles.shareContainer}>
                        <TouchableOpacity style={styles.shareButton} onPress={handleShareKey}>
                            <Image
                                source={require('../../assets/images/Logo-ShareIcon.png')}
                                style={styles.shareIcon}
                            />
                            <Text style={styles.shareLabel}>Share Key</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shareButton} onPress={handleWhatsAppShare}>
                            <Image
                                source={require('../../assets/images/Logo-Whatsapp.jpg')}
                                style={styles.shareIcon}
                            />
                            <Text style={styles.shareLabel}>WhatsApp</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shareButton} onPress={handleInstagramShare}>
                            <Image
                                source={require('../../assets/images/Logo-Instagram.png')}
                                style={styles.shareIcon}
                            />
                            <Text style={styles.shareLabel}>Instagram</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Section - Outside Card */}
                <View style={styles.bottomSection}>
                    <Text style={styles.orText}>OR</Text>

                    <TouchableOpacity style={styles.gotKeyButton} onPress={handleGotKey}>
                        <Text style={styles.gotKeyText}>Got a Key?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }}>
                        <Text style={styles.whyPairText}>Why to Pair?</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Toast always on top */}
            <Toast />
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: THEME.spacing.lg,
        paddingTop: THEME.spacing.md,
        paddingBottom: THEME.spacing.xl,
    },
    infoText: {
        fontSize: THEME.fontSizes.xs,
        color: '#666',
        textAlign: 'center',
        marginBottom: THEME.spacing.md,
    },
    mainCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: THEME.spacing.xl,
        alignItems: 'center',
        position: 'relative',
        flex: 1,
        marginBottom: THEME.spacing.md,
    },
    badge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#FF6B9D',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: THEME.spacing.md,
        textAlign: 'center',
    },
    keySection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing.xs,
    },
    keyEmoji: {
        fontSize: 20,
        marginRight: 6,
    },
    keyLabel: {
        fontSize: THEME.fontSizes.sm,
        color: '#666',
    },
    keyValue: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: 'bold',
        color: '#FF6B9D',
        letterSpacing: 2,
    },
    copyIcon: {
        marginLeft: 8,
        padding: 4,
    },
    refreshContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    refreshText: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.textMuted,
        textDecorationLine: 'underline',
    },
    attemptsText: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.textMuted,
        marginTop: 4,
        marginBottom: THEME.spacing.md,
        fontStyle: 'italic',
    },
    gifContainer: {
        width: '100%',
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    gif: {
        width: '100%',
        height: '100%',
    },
    shareContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: THEME.spacing.sm,
    },
    shareButton: {
        alignItems: 'center',
        flex: 1,
    },
    shareLabel: {
        fontSize: THEME.fontSizes.xs,
        color: '#666',
        marginTop: 6,
    },
    shareIcon: {
        width: 56,
        height: 56,
    },
    iconImage: {
        width: 28,
        height: 28,
    },
    bottomSection: {
        alignItems: 'center',
    },
    orText: {
        fontSize: THEME.fontSizes.md,
        color: '#FFFFFF',
        marginBottom: THEME.spacing.md,
    },
    gotKeyButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 48,
        paddingVertical: 14,
        borderRadius: 28,
        marginBottom: THEME.spacing.md,
    },
    gotKeyText: {
        fontSize: THEME.fontSizes.md,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    whyPairText: {
        fontSize: THEME.fontSizes.sm,
        color: '#FFFFFF',
        textDecorationLine: 'underline',
    },
});
