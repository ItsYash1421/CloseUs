import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { BlurView } from '@react-native-community/blur';
import { BLUR_CONFIG } from '../../constants/blur';

interface ProfileStatsProps {
    daysTogether: number;
    questionsCount: number;
    gamesWon: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
    daysTogether,
    questionsCount,
    gamesWon,
}) => {
    return (
        <View style={styles.container}>
            {/* Days Together - Big Card */}
            <View style={styles.bigCard}>
                {/* Logo Image in Circle */}
                <View style={styles.logoCircle}>
                    <Image
                        source={require('../../assets/images/Logo-Together.png')}
                        style={styles.logoImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.bigCardContent}>
                    <Text style={styles.daysValue}>{daysTogether}</Text>
                    <Text style={styles.daysLabel}>DAYS TOGETHER</Text>
                </View>
            </View>

            {/* Small Cards Grid - Commented out for later */}
            {/* <View style={styles.grid}>
                <View style={styles.glassPanel}>
                    <View style={styles.smallCardContent}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                            <Icon name="forum" size={20} color={COLORS.blue400} />
                        </View>
                        <View>
                            <Text style={styles.statValue}>{questionsCount}</Text>
                            <Text style={styles.statLabel}>Questions</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.glassPanel}>
                    <View style={styles.smallCardContent}>
                        <View style={[styles.iconBox, { backgroundColor: COLORS.blue500 }]}>
                            <Icon name="emoji-events" size={20} color={COLORS.white} />
                        </View>
                        <View>
                            <Text style={styles.statValue}>{gamesWon}</Text>
                            <Text style={styles.statLabel}>Games Won</Text>
                        </View>
                    </View>
                </View>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20, // px-5
        gap: 16, // gap-4
    },
    bigCard: {
        backgroundColor: COLORS.white, // White background
        borderRadius: 24, // rounded-3xl
        padding: 24, // p-6
        height: 140, // consistent height
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        // Soft shadow
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50, // Perfect circle
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        // Soft shadow for depth
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    bigCardContent: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 8, // Shift text slightly to the right
    },
    daysValue: {
        fontSize: 36, // text-4xl
        fontWeight: '900', // font-black
        color: COLORS.black, // Black text
    },
    daysLabel: {
        fontSize: 12, // text-xs
        fontWeight: '600', // font-semibold
        color: COLORS.textMuted, // Muted black text
        marginTop: 4, // mt-1
        textTransform: 'uppercase', // uppercase
        letterSpacing: 1, // tracking-wider
    },
    grid: {
        flexDirection: 'row',
        gap: 16, // gap-4
    },
    glassPanel: {
        flex: 1,
        // glass-panel: bg-zinc-800/30 backdrop-blur-md border-white/8
        backgroundColor: 'rgba(39, 39, 42, 0.3)',
        borderRadius: 24, // rounded-3xl
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        padding: 20, // p-5
        alignItems: 'center',
        justifyContent: 'center',
        // shadow-card
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 4,
    },
    smallCardContent: {
        alignItems: 'center',
        gap: 8, // gap-2
    },
    iconBox: {
        width: 40, // w-10
        height: 40, // h-10
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4, // mb-1
        // shadow-inner equivalent - handled by styling or simple background opacity
    },
    statValue: {
        fontSize: 24, // text-2xl
        fontWeight: '700', // font-bold
        color: COLORS.white, // text-white
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 12, // text-xs
        fontWeight: '500', // font-medium
        color: COLORS.zinc400, // text-text-muted
        textAlign: 'center',
    },
});
