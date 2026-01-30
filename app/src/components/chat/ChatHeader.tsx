import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { BLUR_CONFIG } from '../../constants/blur';
import { User } from '../../types';

// Gender-based logo images
const MALE_LOGO = require('../../assets/images/Logo-Male-2-bgless.png');
const FEMALE_LOGO = require('../../assets/images/Logo-Female-2-bgless.png');

interface ChatHeaderProps {
    user: User | null;
    partner: User | null;
    isOnline: boolean;
    isConnected: boolean;
    onBack?: () => void;
    onOptions?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    user,
    partner,
    isOnline,
    isConnected,
    onBack,
    onOptions,
}) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigation.goBack();
        }
    };

    const getGenderLogo = (gender?: 'male' | 'female') => {
        return gender === 'female' ? FEMALE_LOGO : MALE_LOGO;
    };

    // Use actual firstName from user data
    const userName = user?.name || 'You';
    const partnerName = partner?.name || 'Partner';
    const displayName = `${userName} & ${partnerName}`;

    const statusText = isConnected
        ? (isOnline ? 'Online now' : 'Offline')
        : 'Connecting...';

    const statusColor = isConnected && isOnline ? '#60A5FA' : COLORS.textSecondary;

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

            <View style={[styles.content, { paddingTop: insets.top + 12, paddingBottom: 18 }]}>
                <View style={styles.row}>
                    {/* Left: Back Button and Avatars */}
                    <View style={styles.leftSection}>
                        <TouchableOpacity
                            onPress={handleBack}
                            style={styles.backButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Icon name="arrow-back-ios" size={20} color={COLORS.white} />
                        </TouchableOpacity>

                        <View style={styles.profileSection}>
                            {/* Overlapping Avatars */}
                            <View style={styles.avatarsContainer}>
                                {/* User Avatar (Left) */}
                                <View style={[styles.avatarWrapper, styles.avatarLeft]}>
                                    <Image
                                        source={getGenderLogo(user?.gender)}
                                        style={styles.avatar}
                                        resizeMode="cover"
                                    />
                                </View>

                                {/* Partner Avatar (Right - Overlapping) */}
                                <View style={[styles.avatarWrapper, styles.avatarRight]}>
                                    <Image
                                        source={getGenderLogo(partner?.gender)}
                                        style={styles.avatar}
                                        resizeMode="cover"
                                    />
                                </View>
                            </View>

                            {/* Names and Status */}
                            <View style={styles.textContainer}>
                                <Text style={styles.names} numberOfLines={1}>
                                    {displayName}
                                </Text>
                                <Text style={[styles.status, { color: statusColor }]}>
                                    {statusText}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Right: Options Button */}
                    <TouchableOpacity
                        onPress={onOptions}
                        style={styles.optionsButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Icon name="more-vert" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        zIndex: 100,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
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
        paddingHorizontal: 24, // px-6 from ref
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // gap-3 matching div
    },
    backButton: {
        marginLeft: -8, // -ml-2
        padding: 8,
        borderRadius: 20,
        // bg-white/5 hover effect simulated by touchable opacity
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
    },
    avatarsContainer: {
        flexDirection: 'row',
        width: 52, // Enough space for two 32px avatars overlapping
        height: 32,
    },
    avatarWrapper: {
        width: 32, // w-8
        height: 32, // h-8
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)', // border-white/20
        overflow: 'hidden',
        position: 'absolute',
    },
    avatarLeft: {
        left: 0,
        zIndex: 1,
    },
    avatarRight: {
        left: 20, // -space-x-3 -> roughly 12px overlap, so 20px offset
        zIndex: 2,
        backgroundColor: '#121217', // surface-dark fallback
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        backgroundColor: COLORS.glass,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    textContainer: {
        justifyContent: 'center',
        marginLeft: 4, // slight adjustment for visual balance
    },
    names: {
        fontSize: 16, // text-sm is usually 14px in tailwind, but header looks bigger in image. Let's go 15-16.
        fontWeight: '700', // font-bold
        color: '#F4F4F5', // text-primary
        letterSpacing: -0.2, // tracking-tight
        marginBottom: 2,
    },
    status: {
        fontSize: 12, // text-[10px] is very small, 12 is better for readability on mobile
        fontWeight: '500', // font-medium
    },
    optionsButton: {
        marginRight: -8, // -mr-2
        padding: 8,
        borderRadius: 20,
    },
});
