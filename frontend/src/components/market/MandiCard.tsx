import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MarketResult } from '../../types';
import { colors } from '../../theme/colors';
import { PriceTag } from './PriceTag';

interface MandiCardProps {
  market: MarketResult;
}

export const MandiCard: React.FC<MandiCardProps> = ({ market }) => {
  const getBorderColor = () => {
    if (market.r_net > 2000) return colors.accent.emerald;
    if (market.r_net > 1500) return colors.accent.amber;
    return colors.accent.rose;
  };

  return (
    <View style={[styles.container, { borderLeftColor: getBorderColor() }]}>
      <View style={styles.header}>
        <Text style={styles.name}>{market.name}</Text>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{market.distance_km} km</Text>
        </View>
      </View>

      <View style={styles.rNetContainer}>
        <Text style={styles.rNetLabel}>Net Realization (R_net)</Text>
        <PriceTag amount={market.r_net} size="lg" />
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Base Price</Text>
          <PriceTag amount={market.base_price_per_quintal} size="sm" />
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Toll Fees</Text>
          <PriceTag amount={market.toll_fees} size="sm" />
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Loading</Text>
          <PriceTag amount={market.loading_charge} size="sm" />
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Cess</Text>
          <Text style={styles.detailValue}>{market.cess_percent}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.card,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: colors.bg.elevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  rNetContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: colors.bg.secondary,
    padding: 12,
    borderRadius: 12,
  },
  rNetLabel: {
    fontSize: 12,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
});
