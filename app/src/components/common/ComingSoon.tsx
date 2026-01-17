import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

const { width } = Dimensions.get('window');

interface ComingSoonProps {
    title?: string;
    description?: string;
    onNotify?: () => void;
    imageSource?: any;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
    title = 'Coming Soon',
    description = 'We are working hard to bring you something special. Stay tuned for the ultimate couple\'s experience!',
    onNotify,
    imageSource = require('../../assets/images/Logo-ComingSoon.png'),
}) => {
    return (
        <View style={styles.container}>
            {/* 3D Illustration */}
            <View style={styles.imageContainer}>
                <Image
                    source={imageSource}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.notifyButton}
                        onPress={onNotify || (() => { })}
                        activeOpacity={0.8}
                    >
                        <Text style={{ fontSize: 20, marginRight: 8 }}>🔔</Text>
                        <Text style={styles.notifyButtonText}>Notify Me</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: THEME.spacing.xl,
        backgroundColor: 'transparent',
    },
    imageContainer: {
        width: width * 0.8,
        height: width * 0.8,
        marginBottom: THEME.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: THEME.fontSizes.xxxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
        marginBottom: THEME.spacing.md,
        textAlign: 'center',
    },
    description: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: THEME.spacing.xxl,
        lineHeight: 24,
        paddingHorizontal: THEME.spacing.sm,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 280,
    },
    notifyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: THEME.spacing.sm,
        paddingHorizontal: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        height: 48,
    },
    notifyButtonText: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
        color: '#1F1F1F',
    },
});
