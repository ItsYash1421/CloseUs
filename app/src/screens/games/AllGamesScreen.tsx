
import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native';
import { GradientBackground, Header } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import gamesService, { GameCategory } from '../../services/gamesService';

const { width } = Dimensions.get('window');
const SPACING = THEME.spacing.lg;
const CARD_WIDTH = (width - SPACING * 2 - SPACING) / 2;

export const AllGamesScreen = ({ navigation }: any) => {
    const [categories, setCategories] = useState<GameCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const data = await gamesService.getCategories();
            // Filter active categories
            const activeCategories = data.filter(c => c.isActive);
            setCategories(activeCategories);
        } catch (error) {
            console.error('Failed to load games:', error);
            Alert.alert('Error', 'Failed to load games');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGamePress = (category: GameCategory) => {
        if (!category.isActive) {
            Alert.alert('Coming Soon', 'This game will be available soon!');
            return;
        }

        if (category.questionCount === 0) {
            Alert.alert('No Questions', 'This category has no questions yet.');
            return;
        }

        navigation.navigate('CategoryQuestions', {
            categoryId: category._id,
            categoryName: category.name,
            categoryEmoji: category.emoji,
            categoryColor: category.color,
        });
    };

    return (
        <GradientBackground variant="background">
            <Header
                title="All Games"
                showBack
                onBack={() => navigation.goBack()}
            />

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.grid}>
                        {categories.map(category => (
                            <TouchableOpacity
                                key={category._id}
                                style={styles.card}
                                activeOpacity={0.8}
                                onPress={() => handleGamePress(category)}
                            >
                                <View style={styles.cardContent}>
                                    {/* Circle Image Top Center */}
                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={{
                                                uri:
                                                    category.image ||
                                                    'https://raw.githubusercontent.com/ItsYash1421/Banners/main/Logo-Games-Category.png',
                                            }}
                                            style={styles.cardImage}
                                            resizeMode="cover"
                                        />
                                    </View>

                                    <Text style={styles.gameName}>{category.name}</Text>
                                    <Text style={styles.gameStats}>
                                        {category.totalPlayed || 0} Total played
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: SPACING,
        paddingBottom: 40,
        paddingTop: 70, 
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING,
    },
    card: {
        width: CARD_WIDTH,
        // Slightly taller than width for better proportion
        aspectRatio: 0.8,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    cardContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: '#000',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    gameName: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.white,
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
