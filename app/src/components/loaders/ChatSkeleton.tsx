import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerPlaceholder } from '../common';
import THEME from '../../constants/theme';

export const ChatSkeleton = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Left Content */}
                <View style={styles.leftContent}>
                    {/* Badge Skeleton */}
                    <ShimmerPlaceholder width={100} height={24} borderRadius={20} style={{ marginBottom: 12 }} />

                    {/* Text Container Skeleton */}
                    <View style={styles.textContainer}>
                        <ShimmerPlaceholder width="80%" height={24} borderRadius={4} />
                        <ShimmerPlaceholder width="60%" height={16} borderRadius={4} />
                    </View>

                    {/* Button Skeleton */}
                    <ShimmerPlaceholder width={110} height={40} borderRadius={12} />
                </View>

                {/* Right Image Skeleton */}
                <ShimmerPlaceholder width={128} height={128} borderRadius={64} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    },
    leftContent: {
        flex: 1,
        gap: 12,
    },
    textContainer: {
        gap: 6,
        marginBottom: 8,
    }
});
