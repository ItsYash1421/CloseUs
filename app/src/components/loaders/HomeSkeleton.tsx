import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ShimmerPlaceholder } from '../common';
import { ChatSkeleton } from './ChatSkeleton';
import { JourneySkeleton } from './JourneySkeleton';
import { QuestionSkeleton } from './QuestionSkeleton';
import THEME from '../../constants/theme';
import { BOTTOM_CONTENT_INSET } from '../../constants/layout';

export const HomeSkeleton = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Chat Section */}
                <ChatSkeleton />

                {/* Our Journey */}
                <JourneySkeleton />

                {/* Daily Question */}
                <QuestionSkeleton />

                {/* Quote */}
                <View style={{ paddingHorizontal: 20, alignItems: 'center', marginTop: 16 }}>
                    <ShimmerPlaceholder width="80%" height={16} style={{ marginBottom: 6 }} />
                    <ShimmerPlaceholder width="60%" height={16} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: BOTTOM_CONTENT_INSET,
    },
    content: {
        paddingHorizontal: THEME.spacing.lg,
        gap: THEME.spacing.xl,
        marginTop: 20, // Add some top margin since header is external
    }
});
