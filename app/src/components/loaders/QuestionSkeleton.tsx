import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerPlaceholder } from '../common';
import THEME from '../../constants/theme';

export const QuestionSkeleton = () => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Badge Placeholders */}
                <View style={styles.badgesContainer}>
                    <ShimmerPlaceholder width={100} height={26} borderRadius={13} style={{ alignSelf: 'center' }} />
                    <ShimmerPlaceholder width={80} height={24} borderRadius={12} style={{ marginTop: 12, alignSelf: 'center' }} />
                </View>

                {/* Question Text */}
                <View style={styles.questionTextContainer}>
                    <ShimmerPlaceholder width="90%" height={24} style={{ marginBottom: 8, alignSelf: 'center' }} />
                    <ShimmerPlaceholder width="70%" height={24} style={{ alignSelf: 'center' }} />
                </View>

                {/* Glass Input Placeholder */}
                <View style={styles.inputPlaceholder}>
                    <ShimmerPlaceholder width="100%" height={48} borderRadius={12} />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <ShimmerPlaceholder width={100} height={40} borderRadius={12} />
                    <ShimmerPlaceholder width={100} height={40} borderRadius={12} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: THEME.spacing.lg,
        paddingTop: THEME.spacing.lg,
        position: 'relative',
        height: 380,
        alignItems: 'center',
    },
    badgesContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    questionTextContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 32,
    },
    inputPlaceholder: {
        width: '100%',
        marginBottom: 24,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        width: '100%',
    }
});
