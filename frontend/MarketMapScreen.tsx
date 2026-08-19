import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';

const { height } = Dimensions.get('window');

// Mock coordinates for the mandis around New Delhi since the backend API does not currently return lat/lng
const MOCK_MANDI_COORDINATES: Record<string, { latitude: number, longitude: number }> = {
  "market_a": { latitude: 28.7041, longitude: 77.1025 },
  "market_b": { latitude: 28.5355, longitude: 77.3910 },
  "market_c": { latitude: 28.4595, longitude: 77.0266 },
};

export default function MarketMapScreen({ route }: any) {
  const { qualityScore } = route.params;
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Farmer's mock location (New Delhi)
  const farmerRegion = {
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  useEffect(() => {
    fetchBestMarkets();
  }, []);

  const fetchBestMarkets = async () => {
    try {
      const payload = {
        farmer_lat: farmerRegion.latitude,
        farmer_lon: farmerRegion.longitude,
        batch_weight_quintals: 10.0,
        quality_score: qualityScore,
        vehicle_type: 'mini-truck'
      };
      
      const response = await axios.post('http://10.108.98.115:8000/api/v1/optimize-route', payload);
      setMarkets(response.data);
    } catch (error) {
      console.error("Failed to fetch markets:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMarketCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.marketName}>{item.name}</Text>
        <Text style={styles.distanceText}>{item.distance_km} km away</Text>
      </View>
      
      <View style={styles.profitContainer}>
        <Text style={styles.profitLabel}>Net Profit (R_net)</Text>
        <Text style={styles.profitValue}>₹{item.r_net.toFixed(2)}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Gross Price: ₹{item.realized_price.toFixed(2)} / qtl</Text>
        <Text style={styles.detailText}>Total Deductions: ₹{item.deductions.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Map Section taking up top 45% of screen */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={farmerRegion}
        >
          {/* Farmer Location */}
          <Marker 
            coordinate={{ latitude: farmerRegion.latitude, longitude: farmerRegion.longitude }} 
            title="Your Farm"
            pinColor="blue"
          />
          
          {/* Mandi Locations */}
          {markets.map((market) => {
            const coords = MOCK_MANDI_COORDINATES[market.id] || { latitude: 28.6139, longitude: 77.2090 };
            return (
              <Marker
                key={market.id}
                coordinate={coords}
                title={market.name}
                description={`Net Profit: ₹${market.r_net.toFixed(2)}`}
                pinColor="green"
              />
            );
          })}
        </MapView>
      </View>

      {/* List Section taking up bottom portion */}
      <View style={styles.listContainer}>
        <Text style={styles.title}>Optimized Routes</Text>
        <Text style={styles.subtitle}>Based on Q-Score: {qualityScore}</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#10b981" style={styles.loader} />
        ) : (
          <FlatList
            data={markets}
            keyExtractor={(item) => item.id}
            renderItem={renderMarketCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mapContainer: {
    height: height * 0.45,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  loader: {
    marginTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#10b981',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  marketName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  distanceText: {
    fontSize: 14,
    color: '#ff9800',
    fontWeight: '600',
  },
  profitContainer: {
    backgroundColor: '#2d3748',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  profitLabel: {
    fontSize: 14,
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  profitValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#10b981',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
});
