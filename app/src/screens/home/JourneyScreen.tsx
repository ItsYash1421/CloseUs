import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GradientBackground, Header, ComingSoon } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

export const JourneyScreen = ({ navigation }: any) => {
    return (
        <GradientBackground variant="background">
            <Header title="Our Journey" />
            <View style={styles.container}>
                <ComingSoon
                    title="Coming Soon!"
                    description="We're crafting a beautiful timeline of your love story. Get ready to relive your best memories!"
                    onNotify={() => Alert.alert('Notified!', 'We\'ll let you know when this feature is ready.')}
                />
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 60, // Account for absolute header height
    },
});
