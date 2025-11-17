/**
 * App Navigation Structure
 * Defines navigation flow and routes for the app
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StorageService } from '../services/StorageService';

// Import screens
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import FocusSessionScreen from '../screens/FocusSessionScreen';
import TaskCompletionScreen from '../screens/TaskCompletionScreen';
import ScreenTimeInsightsScreen from '../screens/ScreenTimeInsightsScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#2a2a2a',
          borderTopColor: '#333',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        headerStyle: {
          backgroundColor: '#2a2a2a',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🏠</span>,
        }}
      />
      <Tab.Screen
        name="ScreenTimeInsights"
        component={ScreenTimeInsightsScreen}
        options={{
          tabBarLabel: 'Screen Time',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>📊</span>,
          title: 'Screen Time Insights',
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🏆</span>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>⚙️</span>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isOnboarded, setIsOnboarded] = useState(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const completed = await StorageService.isOnboardingCompleted();
    setIsOnboarded(completed);
  };

  if (isOnboarded === null) {
    return null; // Loading state
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isOnboarded ? 'Main' : 'Onboarding'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2a2a2a',
          },
          headerTintColor: '#fff',
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FocusSession"
          component={FocusSessionScreen}
          options={{
            title: 'Focus Session',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="TaskCompletion"
          component={TaskCompletionScreen}
          options={{
            title: 'Session Complete',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
