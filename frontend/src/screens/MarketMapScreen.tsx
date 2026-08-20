import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { colors } from '../theme/colors';
import { MandiCard } from '../components/market/MandiCard';
import apiClient from '../api/client';
import { MarketResult } from '../types';

export const MarketMapScreen = ({ route }: any) => {
  const qualityScore = route.params?.qualityScore || 85;
  const [markets, setMarkets] = useState<MarketResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const payload = {
        farmer_id: 1,
        produce_type: 'wheat',
        quantity_quintals: 10,
        quality_score: qualityScore,
      };
      const response = await apiClient.post('/optimize-route', payload);
      setMarkets(response.data.ranked_markets || []);
    } catch (error) {
      console.log('Error fetching markets, using mock data');
      setMarkets([
        {
          id: 'M1',
          name: 'Azadpur Mandi',
          distance_km: 12.5,
          base_price_per_quintal: 2200,
          toll_fees: 50,
          loading_charge: 100,
          cess_percent: 2,
          r_net: 2006,
          realized_price: 20060,
          deductions: 194,
          lat: 28.736,
          lon: 77.172,
        },
        {
          id: 'M2',
          name: 'Ghazipur Mandi',
          distance_km: 25.0,
          base_price_per_quintal: 2300,
          toll_fees: 80,
          loading_charge: 100,
          cess_percent: 2,
          r_net: 2074,
          realized_price: 20740,
          deductions: 226,
          lat: 28.627,
          lon: 77.327,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent.emerald} />
        <Text style={styles.loadingText}>Finding Optimal Markets...</Text>
      </View>
    );
  }

  const initialRegion = markets.length > 0 ? {
    latitude: markets[0].lat || 28.6139,
    longitude: markets[0].lon || 77.2090,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  } : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={initialRegion}
          userInterfaceStyle="dark"
        >
          {markets.map((market) => (
            market.lat && market.lon && (
              <Marker
                key={market.id}
                coordinate={{ latitude: market.lat, longitude: market.lon }}
                title={market.name}
                description={`₹${market.r_net} Net Realization`}
                pinColor={market.r_net > 2000 ? colors.accent.emerald : colors.accent.amber}
              />
            )
          ))}
        </MapView>
      </View>
      
      <View style={styles.listContainer}>
        <FlatList
          data={markets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MandiCard market={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.text.secondary,
    fontSize: 16,
  },
  mapContainer: {
    height: '40%',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
