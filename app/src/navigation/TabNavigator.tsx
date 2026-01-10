import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types';
import { COLORS } from '../constants/colors';
import THEME from '../constants/theme';

// Screens (to be imported)
import { HomeScreen } from '../screens/home/HomeScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { QuestionsScreen } from '../screens/questions/QuestionsScreen';
import { GamesScreen } from '../screens/games/GamesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.backgroundCard,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 60,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarLabelStyle: {
                    fontSize: THEME.fontSizes.xs,
                    fontWeight: THEME.fontWeights.semibold,
                },
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💬</Text>,
                }}
            />
            <Tab.Screen
                name="Questions"
                component={QuestionsScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>❓</Text>,
                }}
            />
            <Tab.Screen
                name="Games"
                component={GamesScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🎮</Text>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
                }}
            />
        </Tab.Navigator>
    );
};
