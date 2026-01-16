import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { screenTransitionConfig } from '../utils/screenTransitions';
import { navigationRef } from '../services/navigationService';

// Auth Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';

// Onboarding Screens (to be created)
import { PersonalInfoScreen } from '../screens/onboarding/PersonalInfoScreen';
import { GenderSelectionScreen } from '../screens/onboarding/GenderSelectionScreen';
import { RelationshipStatusScreen } from '../screens/onboarding/RelationshipStatusScreen';
import { LivingStyleScreen } from '../screens/onboarding/LivingStyleScreen';
import { AnniversaryScreen } from '../screens/onboarding/AnniversaryScreen';

// Pairing Screens (to be created)
import { CreateKeyScreen } from '../screens/pairing/CreateKeyScreen';
import { EnterKeyScreen } from '../screens/pairing/EnterKeyScreen';
import { PairingSuccessScreen } from '../screens/pairing/PairingSuccessScreen';

// Main App (to be created)
import { TabNavigator } from './TabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    ...screenTransitionConfig,
                    presentation: 'card',
                    cardOverlayEnabled: false,
                }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                {/* Uncomment as screens are created */}
                <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
                <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
                <Stack.Screen name="RelationshipStatus" component={RelationshipStatusScreen} />
                <Stack.Screen name="LivingStyle" component={LivingStyleScreen} />
                <Stack.Screen name="Anniversary" component={AnniversaryScreen} />
                <Stack.Screen
                    name="CreateKey"
                    component={CreateKeyScreen}
                    options={{
                        animationEnabled: true,
                        detachPreviousScreen: false,
                        cardStyleInterpolator: ({ current: { progress } }) => ({
                            cardStyle: {
                                opacity: progress,
                            },
                        }),
                    }}
                />
                <Stack.Screen
                    name="EnterKey"
                    component={EnterKeyScreen}
                    options={{
                        animationEnabled: true,
                        detachPreviousScreen: false,
                        cardStyleInterpolator: ({ current: { progress } }) => ({
                            cardStyle: {
                                opacity: progress,
                            },
                        }),
                    }}
                />
                <Stack.Screen name="PairingSuccess" component={PairingSuccessScreen} />
                <Stack.Screen name="MainTabs" component={TabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
