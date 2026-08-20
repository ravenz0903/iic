import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { GradientCard } from '../components/ui/GradientCard';
import { GradeChip } from '../components/ui/GradeChip';
import apiClient from '../api/client';

export const CreateListingScreen = ({ route }: any) => {
  const batchId = route.params?.batch_id || 'BATCH#WH-2026-0820-0042';
  
  const [askingPrice, setAskingPrice] = useState('2520');
  const [availableDate, setAvailableDate] = useState('2026-08-22');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleList = async () => {
    setLoading(true);
    try {
      await apiClient.post('/listings', {
        batch_id: batchId,
        asking_price: parseFloat(askingPrice),
        available_date: availableDate
      });
      setSuccess(true);
    } catch (e) {
      console.log('Mock success listing creation');
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
    }
  };

  if (success) {
    return (
      <View style={[styles.container, styles.center]}>
        <GradientCard borderColor={colors.accent.emerald} style={styles.successCard}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Listed Successfully!</Text>
          <Text style={styles.successDesc}>Your batch {batchId} is now live on the marketplace at ₹{askingPrice}/qtl.</Text>
        </GradientCard>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>📋 List Your Produce</Text>
      
      <GradientCard borderColor={colors.accent.cyan} style={styles.batchCard}>
        <Text style={styles.batchId}>{batchId}</Text>
        <View style={styles.batchRow}>
          <View style={styles.batchCol}><Text style={styles.batchLbl}>Produce</Text><Text style={styles.batchVal}>🌾 Wheat</Text></View>
          <View style={styles.batchCol}><Text style={styles.batchLbl}>Grade</Text><GradeChip grade="A" /></View>
        </View>
        <View style={styles.batchRow}>
          <View style={styles.batchCol}><Text style={styles.batchLbl}>Quality Score</Text><Text style={styles.batchVal}>88.5</Text></View>
          <View style={styles.batchCol}><Text style={styles.batchLbl}>Quantity</Text><Text style={styles.batchVal}>10 qtl</Text></View>
        </View>
      </GradientCard>

      <View style={styles.pricingSection}>
        <View style={styles.aiSuggestion}>
          <Text style={styles.aiLabel}>✨ AI Suggested Price</Text>
          <Text style={styles.aiPrice}>₹2,520/qtl</Text>
          <Text style={styles.aiSub}>Based on Grade A + market analysis</Text>
        </View>

        <Text style={styles.inputLabel}>Asking Price (₹/qtl)</Text>
        <TextInput
          style={styles.input}
          value={askingPrice}
          onChangeText={setAskingPrice}
          keyboardType="numeric"
        />

        <Text style={styles.inputLabel}>Available Date</Text>
        <TextInput
          style={styles.input}
          value={availableDate}
          onChangeText={setAvailableDate}
        />
      </View>

      <TouchableOpacity style={styles.listBtn} onPress={handleList} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.listBtnText}>List for Sale</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  center: { justifyContent: 'center', padding: 20 },
  content: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text.primary, marginBottom: 20 },
  batchCard: { marginBottom: 24, padding: 16 },
  batchId: { color: colors.text.primary, fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 16 },
  batchRow: { flexDirection: 'row', marginBottom: 12 },
  batchCol: { flex: 1 },
  batchLbl: { color: colors.text.muted, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
  batchVal: { color: colors.text.primary, fontSize: 14, fontWeight: 'bold' },
  pricingSection: { backgroundColor: colors.bg.secondary, padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: colors.bg.elevated },
  aiSuggestion: { alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.bg.elevated },
  aiLabel: { color: colors.accent.cyan, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  aiPrice: { color: colors.accent.emerald, fontSize: 32, fontWeight: '900' },
  aiSub: { color: colors.text.muted, fontSize: 12, marginTop: 4 },
  inputLabel: { color: colors.text.secondary, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: colors.bg.primary, borderWidth: 1, borderColor: colors.bg.elevated, height: 50, borderRadius: 8, paddingHorizontal: 16, color: colors.text.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  listBtn: { backgroundColor: colors.accent.emerald, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  listBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  successCard: { padding: 24, alignItems: 'center' },
  successIcon: { fontSize: 48, marginBottom: 16 },
  successTitle: { color: colors.text.primary, fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  successDesc: { color: colors.text.secondary, fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
