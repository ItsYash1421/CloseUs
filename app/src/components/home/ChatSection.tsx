import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

interface ChatSectionProps {
    onOpenChat: () => void;
    partnerName?: string;
    isOnline?: boolean;
    userGender?: 'male' | 'female';
}

export const ChatSection: React.FC<ChatSectionProps> = ({
    onOpenChat,
    partnerName = 'Partner',
    isOnline = true,
    userGender = 'male'
}) => {
    // Male users see female logo, female users see male logo
    const mascotImage = userGender === 'male'
        ? require('../../assets/images/Logo-Female-2-bgless.png')
        : require('../../assets/images/Logo-Male-2-bgless.png');

    return (
        <View style={styles.container}>

            <View style={styles.content}>
                {/* Left Content */}
                <View style={styles.leftContent}>
                    {/* Online/Offline Status Badge */}
                    <View style={[styles.onlineBadge, !isOnline && styles.offlineBadge]}>
                        <View style={[styles.pulseDot, !isOnline && styles.offlineDot]} />
                        <Text style={styles.onlineText}>
                            {isOnline ? 'PARTNER ONLINE' : 'PARTNER OFFLINE'}
                        </Text>
                    </View>

                    {/* Title & Subtitle */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Need a Sweet Talk?</Text>
                        <Text style={styles.subtitle}>{partnerName} is waiting for you...</Text>
                    </View>

                    {/* Chat Now Button */}
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={onOpenChat}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.chatButtonText}>Chat Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Right Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={mascotImage}
                        style={styles.mascotImage}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },

    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        zIndex: 10,
    },
    leftContent: {
        flex: 1,
        gap: 12,
    },
    onlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignSelf: 'flex-start',
    },
    offlineBadge: {
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
    },
    pulseDot: {
        width: 6,
        height: 6,
        backgroundColor: '#4ADE80',
        borderRadius: 3,
        shadowColor: '#4ADE80',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 4,
    },
    offlineDot: {
        backgroundColor: '#9CA3AF',
        shadowColor: '#9CA3AF',
    },
    onlineText: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 1.2,
    },
    textContainer: {
        gap: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.white,
        lineHeight: 26,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 2,
    },
    chatButton: {
        backgroundColor: COLORS.white,
        height: 40,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F1F1F',
    },
    imageContainer: {
        position: 'relative',
        width: 128,
        height: 128,
        flexShrink: 0,
        backgroundColor: 'rgba(128, 128, 128, 0.15)',
        borderRadius: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mascotImage: {
        width: '100%',
        height: '100%',
    },
});
