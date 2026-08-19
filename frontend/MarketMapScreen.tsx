import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import api from './api';

export default function MarketMapScreen({ route }: any) {
  const { qualityScore } = route.params;
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestMarkets();
  }, []);

  const fetchBestMarkets = async () => {
    try {
      // Hardcoded payload as requested
      const payload = {
        farmer_lat: 28.6139,
        farmer_lon: 77.2090,
        batch_weight_quintals: 10.0,
        quality_score: qualityScore,
        vehicle_type: 'mini-truck'
      };
      
      const response = await api.post('/optimize-route', payload);
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loader: {
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    marginBottom: 20,
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
