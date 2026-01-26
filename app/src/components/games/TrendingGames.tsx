import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { GameCategory } from '../../services/gamesService';

const { width } = Dimensions.get('window');
const SPACING = THEME.spacing.lg; // 24

interface TrendingGamesProps {
    games: GameCategory[];
    onGamePress: (game: GameCategory) => void;
}

export const TrendingGames = ({ games, onGamePress }: TrendingGamesProps) => {
    if (games.length === 0) return null;

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending Now</Text>
                <TouchableOpacity>
                    <Text style={styles.showAllText}>SHOW ALL</Text>
                </TouchableOpacity>
            </View>

            {/* Full Width ScrollView using negative margin */}
            <View style={styles.scrollContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.trendingScroll}
                    snapToInterval={180 + 16} // card width + gap
                    decelerationRate="fast"
                >
                    {games.map((category, index) => (
                        <TouchableOpacity
                            key={category._id}
                            activeOpacity={0.8}
                            onPress={() => onGamePress(category)}
                            style={[
                                styles.cardWrapper,
                                index === 0 && { marginLeft: SPACING }, // Left spacing for first item
                                index === games.length - 1 && { marginRight: SPACING } // Right spacing for last item
                            ]}
                        >
                            <View style={styles.trendingCardContainer}>
                                {/* Circle Image Top Center */}
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: category.image || 'https://raw.githubusercontent.com/ItsYash1421/Banners/main/Logo-Games-Category.png' }}
                                        style={styles.cardImage}
                                        resizeMode="cover"
                                    />
                                </View>

                                {/* Content */}
                                <View style={styles.cardContent}>
                                    <Text style={styles.gameName}>{category.name}</Text>
                                    <Text style={styles.gameStats}>{category.timesPlayed} playing now</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: THEME.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.md, // Reduced margin
    },
    sectionTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: '700',
        color: COLORS.white,
    },
    showAllText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    scrollContainer: {
        marginHorizontal: -SPACING, // Bleed out to edges
    },
    trendingScroll: {
        paddingHorizontal: 0, // Handled by first/last item margins
        gap: 16,
    },
    cardWrapper: {
        width: 180,
        height: 220,
    },
    trendingCardContainer: {
        flex: 1,
        borderRadius: 24,
        // DailyQuestionHomeCard style:
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        position: 'relative',
        overflow: 'hidden', // if glass effect
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: '#000', // placeholder background
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        alignItems: 'center',
        width: '100%',
    },
    gameName: {
        fontSize: 13, // slightly bigger
        fontWeight: '800',
        color: COLORS.white, // Updated to White
        marginBottom: 4,
        letterSpacing: 0.5,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    gameStats: {
        fontSize: 10,
        color: '#B0B0B0',
        fontWeight: '500',
        textAlign: 'center',
    },
});
