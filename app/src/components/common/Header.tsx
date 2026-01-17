import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { BLUR_CONFIG } from '../../constants/blur';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    showChat?: boolean;
    onBack?: () => void;
    onChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showBack = true,
    showChat = true,
    onBack,
    onChat,
}) => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigation.goBack();
        }
    };

    const handleChat = () => {
        if (onChat) {
            onChat();
        } else {
            navigation.navigate('Chat');
        }
    };

    return (
        <View style={styles.wrapper}>
            {/* Glass Background */}
            <BlurView
                style={StyleSheet.absoluteFill}
                blurType={BLUR_CONFIG.blurType}
                blurAmount={BLUR_CONFIG.blurAmount}
                reducedTransparencyFallbackColor={BLUR_CONFIG.fallbackColor}
            />

            {/* Tint & Border Overlays */}
            <View style={styles.tintOverlay} />
            <View style={styles.borderOverlay} />

            {/* Content */}
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.content}>
                    {/* Left: Back Button */}
                    <View style={styles.left}>
                        {showBack ? (
                            <TouchableOpacity onPress={handleBack} style={styles.button}>
                                {/* Custom CSS Chevron Left to ensure visibility without fonts */}
                                <View style={styles.chevronLeft} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.placeholder} />
                        )}
                    </View>

                    {/* Center: Title */}
                    <View style={styles.center}>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    {/* Right: Chat Button */}
                    <View style={styles.right}>
                        {showChat ? (
                            <TouchableOpacity onPress={handleChat} style={styles.button}>
                                <View style={styles.chatIconWrapper}>
                                    <Text style={styles.chatIconText}>💬</Text>
                                    <View style={styles.heartBadge}>
                                        <Text style={styles.heartText}>♥</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.placeholder} />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        zIndex: 100,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    container: {
        zIndex: 101,
    },
    // Glass Overlays
    tintOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: BLUR_CONFIG.tints.none,
    },
    borderOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    content: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.md,
    },
    left: {
        width: 48,
        alignItems: 'flex-start',
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    right: {
        width: 48,
        alignItems: 'flex-end',
    },
    title: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
        textAlign: 'center',
    },
    button: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        // Removed background color
    },
    // Custom Chevron for Back Button
    chevronLeft: {
        width: 12,
        height: 12,
        borderLeftWidth: 3, // Thicker border for better visibility
        borderBottomWidth: 3,
        borderColor: COLORS.white,
        transform: [{ rotate: '45deg' }],
        marginLeft: 4, // Adjust optical center
    },
    placeholder: {
        width: 48,
    },
    // Custom Chat Icon Styles
    chatIconWrapper: {
        position: 'relative',
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatIconText: {
        fontSize: 24,
        color: COLORS.white,
        backgroundColor: 'transparent',
    },
    heartBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        // Cutout effect
        borderRadius: 8,
        padding: 1,
    },
    heartText: {
        fontSize: 10,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});
