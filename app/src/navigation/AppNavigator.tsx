import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { navigationRef } from '../services/navigationService';

// Auth Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';

// Onboarding Screens
import { PersonalInfoScreen } from '../screens/onboarding/PersonalInfoScreen';
import { GenderSelectionScreen } from '../screens/onboarding/GenderSelectionScreen';
import { RelationshipStatusScreen } from '../screens/onboarding/RelationshipStatusScreen';
import { LivingStyleScreen } from '../screens/onboarding/LivingStyleScreen';
import { AnniversaryScreen } from '../screens/onboarding/AnniversaryScreen';

// Pairing Screens
import { CreateKeyScreen } from '../screens/pairing/CreateKeyScreen';
import { EnterKeyScreen } from '../screens/pairing/EnterKeyScreen';
import { PairingSuccessScreen } from '../screens/pairing/PairingSuccessScreen';

import { JourneyScreen } from '../screens/home/JourneyScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { QuestionsScreen } from '../screens/questions/QuestionsScreen';
import { TabNavigator } from './TabNavigator';


const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    cardStyleInterpolator: ({ current }) => ({
                        cardStyle: {
                            opacity: current.progress,
                        },
                    }),
                }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
                <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
                <Stack.Screen name="RelationshipStatus" component={RelationshipStatusScreen} />
                <Stack.Screen name="LivingStyle" component={LivingStyleScreen} />
                <Stack.Screen name="Anniversary" component={AnniversaryScreen} />
                <Stack.Screen name="CreateKey" component={CreateKeyScreen} />
                <Stack.Screen name="EnterKey" component={EnterKeyScreen} />
                <Stack.Screen name="PairingSuccess" component={PairingSuccessScreen} />
                <Stack.Screen name="MainTabs" component={TabNavigator} />
                <Stack.Screen name="Journey" component={JourneyScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Questions" component={QuestionsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
