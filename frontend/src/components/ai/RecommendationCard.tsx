import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { GradientCard } from '../ui/GradientCard';

interface RecommendationCardProps {
  recommendation: {
    summary: string;
    best_market: { name: string; distance: number };
    expected_net: number;
    timing_advice: string;
    confidence: number;
    action?: string;
  };
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const isSellNow = recommendation.action === 'sell_now';
  const glowColor = isSellNow ? colors.accent.emerald : colors.accent.amber;

  return (
    <GradientCard 
      borderColor={glowColor}
      style={[styles.container, { shadowColor: glowColor, shadowRadius: 12, shadowOpacity: 0.4 }]}
    >
      <View style={styles.header}>
        <Text style={styles.aiLabel}>🤖 AI RECOMMENDATION</Text>
      </View>

      <Text style={styles.summary}>{recommendation.summary}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Expected Net</Text>
          <Text style={[styles.statValue, { color: glowColor }]}>
            ₹{recommendation.expected_net.toLocaleString()}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Timing</Text>
          <View style={[styles.timingBadge, { backgroundColor: `${glowColor}33` }]}>
            <Text style={[styles.timingText, { color: glowColor }]}>
              {recommendation.timing_advice}
            </Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Confidence</Text>
          <View style={styles.confCircle}>
            <Text style={styles.confText}>{(recommendation.confidence * 100).toFixed(0)}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.marketInfo}>
        <Text style={styles.marketLabel}>Recommended Market:</Text>
        <Text style={styles.marketName}>
          {recommendation.best_market.name} • {recommendation.best_market.distance} km
        </Text>
      </View>

      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: glowColor }]}>
        <Text style={styles.actionText}>Act on This</Text>
      </TouchableOpacity>
    </GradientCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginVertical: 12,
  },
  header: {
    marginBottom: 12,
  },
  aiLabel: {
    color: colors.accent.cyan,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  summary: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'flex-start',
  },
  statLabel: {
    color: colors.text.muted,
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timingText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  confCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent.cyan,
  },
  confText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  marketInfo: {
    backgroundColor: colors.bg.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  marketLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 2,
  },
  marketName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
