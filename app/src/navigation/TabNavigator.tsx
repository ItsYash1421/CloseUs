import React, { useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TabParamList } from '../types';
import { CustomTabBar } from '../components/navigation/CustomTabBar';
import { COLORS } from '../constants/colors';
import THEME from '../constants/theme';
import { useCoupleStore } from '../store/coupleStore';

// Screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { QuestionsScreen } from '../screens/questions/QuestionsScreen';
import { GamesScreen } from '../screens/games/GamesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  const navigation = useNavigation();
  const couple = useCoupleStore(state => state.couple);

  // Protection: Redirect to CreateKey if not paired
  useEffect(() => {
    if (!couple?.isPaired) {
      console.log('[TabNavigator] User not paired, redirecting to CreateKey');
      navigation.reset({
        index: 0,
        routes: [{ name: 'CreateKey' as never }],
      });
    }
  }, [couple?.isPaired, navigation]);
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
