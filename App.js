import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import MyShiftsScreen from './src/screens/MyShiftsScreen';
import AvailableShiftsScreen from './src/screens/AvailableShiftsScreen';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Available Shifts"
          screenOptions={{
            headerShown: false,

            // We will use our own professional navigation
            // inside the screens instead of the bottom tab bar.
            tabBarStyle: {
              display: 'none',
            },
          }}
        >
          <Tab.Screen
            name="Available Shifts"
            component={AvailableShiftsScreen}
          />

          <Tab.Screen
            name="My Shifts"
            component={MyShiftsScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}