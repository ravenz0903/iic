import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { QualityReportScreen } from '../screens/QualityReportScreen';
import { MarketMapScreen } from '../screens/MarketMapScreen';
import { BatchDetailScreen } from '../screens/BatchDetailScreen';
import { PriceEstimatorScreen } from '../screens/PriceEstimatorScreen';
import { MarketIntelligenceScreen } from '../screens/MarketIntelligenceScreen';
import { CopilotScreen } from '../screens/CopilotScreen';
import { AlertsScreen } from '../screens/AlertsScreen';
import { LogisticsScreen } from '../screens/LogisticsScreen';
import { ProfitCalculatorScreen } from '../screens/ProfitCalculatorScreen';
import { BatchTimelineScreen } from '../screens/BatchTimelineScreen';
import { CreateListingScreen } from '../screens/CreateListingScreen';
import { BuyerMarketplaceScreen } from '../screens/BuyerMarketplaceScreen';
import { BuyerMatchScreen } from '../screens/BuyerMatchScreen';
import { OffersScreen } from '../screens/OffersScreen';
import { SimpleModeScreen } from '../screens/SimpleModeScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.bg.primary,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Scanner" component={ScannerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QualityReport" component={QualityReportScreen} options={{ title: 'Quality Report' }} />
      <Stack.Screen name="MarketMap" component={MarketMapScreen} options={{ title: 'Optimal Markets' }} />
      <Stack.Screen name="BatchDetail" component={BatchDetailScreen} options={{ title: 'Batch Details' }} />
      <Stack.Screen name="PriceEstimator" component={PriceEstimatorScreen} options={{ title: 'AI Price Estimator' }} />
      <Stack.Screen name="MarketIntelligence" component={MarketIntelligenceScreen} options={{ title: 'Market Trends' }} />
      <Stack.Screen name="Copilot" component={CopilotScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Alerts" component={AlertsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Logistics" component={LogisticsScreen} options={{ title: 'Logistics Optimizer' }} />
      <Stack.Screen name="ProfitCalculator" component={ProfitCalculatorScreen} options={{ title: 'Profit Calculator' }} />
      <Stack.Screen name="BatchTimeline" component={BatchTimelineScreen} options={{ title: 'Traceability' }} />
      
      {/* New Phase 3 & 6 Screens */}
      <Stack.Screen name="CreateListing" component={CreateListingScreen} options={{ title: 'List Produce' }} />
      <Stack.Screen name="BuyerMarketplace" component={BuyerMarketplaceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BuyerMatch" component={BuyerMatchScreen} options={{ title: 'AI Buyer Matching' }} />
      <Stack.Screen name="Offers" component={OffersScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SimpleMode" component={SimpleModeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
