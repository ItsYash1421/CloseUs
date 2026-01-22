import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types';
import { CustomTabBar } from '../components/navigation/CustomTabBar';
import { COLORS } from '../constants/colors';
import THEME from '../constants/theme';

// Screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { QuestionsScreen } from '../screens/questions/QuestionsScreen';
import { GamesScreen } from '../screens/games/GamesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Games" component={GamesScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={({ navigation }) => ({
                    headerShown: true,
                    headerTitle: 'Chat',
                    headerStyle: {
                        backgroundColor: COLORS.background,
                    },
                    headerTintColor: COLORS.textPrimary,
                    headerTitleStyle: {
                        fontWeight: THEME.fontWeights.bold,
                        fontSize: THEME.fontSizes.lg,
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Home')}
                            style={{ marginLeft: 16, padding: 8 }}
                        >
                            <Text style={{ fontSize: 24 }}>←</Text>
                        </TouchableOpacity>
                    ),
                    tabBarStyle: { display: 'none' }, // Hide tab bar on Chat screen
                })}
            /> */}
      {/* <Tab.Screen name="Questions" component={QuestionsScreen} /> */}
    </Tab.Navigator>
  );
};
