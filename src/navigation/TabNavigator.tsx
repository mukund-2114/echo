import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { Colors } from '@/constants/colors';

// Screens
import DashboardScreen from '@/screens/DashboardScreen';
import MoodScreen from '@/screens/MoodScreen';
import TasksScreen from '@/screens/TasksScreen';
import LearningScreen from '@/screens/LearningScreen';
import FinanceScreen from '@/screens/FinanceScreen';
import MotivationScreen from '@/screens/MotivationScreen';
import MoreScreen from '@/screens/MoreScreen';
import SleepHistoryScreen from '@/screens/SleepHistoryScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import SectionsScreen from '@/screens/SectionsScreen';
import JournalScreen from '@/screens/JournalScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      {/* Sections screen kept registered but hidden from tab bar */}
      <Tab.Screen
        name="Sections"
        component={SectionsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="📊" color={color} size={size} />
          ),
          // Visible
        }}
      />
      <Tab.Screen
        name="Mood"
        component={MoodScreen}
        options={{
          tabBarLabel: 'Mood',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="🎭" color={color} size={size} />
          ),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="📅" color={color} size={size} />
          ),
          // Visible
        }}
      />
      <Tab.Screen
        name="Learning"
        component={LearningScreen}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="📚" color={color} size={size} />
          ),
          // Visible
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{
          tabBarLabel: 'Finance',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="💰" color={color} size={size} />
          ),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Sleep"
        component={SleepHistoryScreen}
        options={{
          tabBarLabel: 'Sleep',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="😴" color={color} size={size} />
          ),
          // Visible
        }}
      />
      <Tab.Screen
        name="Motivation"
        component={MotivationScreen}
        options={{
          tabBarLabel: 'Motivate',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="✨" color={color} size={size} />
          ),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarLabel: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="📝" color={color} size={size} />
          ),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="🛠️" color={color} size={size} />
          ),
          // Keep Settings visible in tab bar for quick access
        }}
      />
    </Tab.Navigator>
  );
}

// Simple emoji icon component
function TabIcon({ icon, color, size }: { icon: string; color: string; size: number }) {
  // Use Text for React Native compatibility instead of span
  const opacity = color === Colors.primary ? 1 : 0.6;
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <Text style={{ fontSize: size, opacity }}>{icon}</Text>
  );
}
