import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card } from '../common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { GameCategory } from '../../services/gamesService';

interface GamesGridProps {
    games: GameCategory[];
    onGamePress: (game: GameCategory) => void;
}

export const GamesGrid = ({ games, onGamePress }: GamesGridProps) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Categories</Text>

            <View style={styles.gamesList}>
                {games.map((category) => (
                    <View key={category._id} style={styles.gameRowContainer}>
                        {/* Glassmorphism Container */}
                        <View style={styles.glassContainer}>
                            {/* Image Box */}
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(0,0,0,0.2)', overflow: 'hidden' }]}>
                                <Image
                                    source={{ uri: category.image || 'https://raw.githubusercontent.com/ItsYash1421/Banners/main/Logo-Games-Category.png' }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Text Content */}
                            <View style={styles.contentContainer}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.gameName}>{category.name}</Text>
                                    <Text style={styles.questionCount}>{category.questionCount} Questions</Text>
                                </View>

                                {/* Stats Row */}
                                <View style={styles.statsRow}>
                                    <View style={styles.statItem}>
                                        <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
                                        <Text style={styles.statText}>By Me: {Math.floor(category.timesPlayed * 0.4)}</Text>
                                    </View>
                                    <Text style={styles.statDivider}>|</Text>
                                    <View style={styles.statItem}>
                                        <View style={[styles.dot, { backgroundColor: '#B2DFFC' }]} />
                                        <Text style={styles.statText}>Both: {category.timesPlayed}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Play Button */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => onGamePress(category)}
                                style={styles.playButton}
                            >
                                <Text style={styles.playButtonText}>PLAY NOW</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: THEME.spacing.xl,
    },
    sectionTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: THEME.spacing.lg,
    },
    gamesList: {
        gap: 16,
    },
    gameRowContainer: {
        borderRadius: 24,
        // overflow: 'hidden', // Shadows might be clipped
    },
    glassContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.03)', // Updated
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)', // Glass border
        // Neon glow effect (simulated)
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 22, // Squircle shape
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        // Border
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        // Shadow specific to icon
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    iconEmoji: {
        fontSize: 28,
    },
    contentContainer: {
        flex: 1,
        gap: 2, // Tighter gap for stack
        justifyContent: 'center',
    },
    titleRow: {
        // Removed specific row styling, treating as block
        marginBottom: 2,
    },
    gameName: {
        fontSize: 15, // Slightly Larger
        fontWeight: 'bold',
        color: COLORS.white,
    },
    questionCount: {
        fontSize: 11,
        fontWeight: '500',
        color: '#B0B0B0', // Muted
        marginBottom: 6, // Space before stats
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    statText: {
        fontSize: 10,
        color: 'rgba(176, 176, 176, 0.8)', // Muted/80
    },
    statDivider: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.1)',
    },
    playButton: {
        backgroundColor: COLORS.white, // Updated to White
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999, // Pill shape
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        marginLeft: 8,
    },
    playButtonText: {
        fontSize: 10,
        fontWeight: '900', // Black
        color: '#1A1A2E', // Dark text on light button
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
