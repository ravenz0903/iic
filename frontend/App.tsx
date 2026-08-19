import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScannerScreen from './ScannerScreen';
import MarketMapScreen from './MarketMapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Scanner"
        screenOptions={{
          headerStyle: { backgroundColor: '#1e1e1e' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Scanner" 
          component={ScannerScreen} 
          options={{ title: 'Produce Assessment' }}
        />
        <Stack.Screen 
          name="MarketMap" 
          component={MarketMapScreen} 
          options={{ title: 'Market Recommendations' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
