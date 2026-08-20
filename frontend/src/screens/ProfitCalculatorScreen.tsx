import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../theme/colors';
import apiClient from '../api/client';

export const ProfitCalculatorScreen = () => {
  const [sellingPrice, setSellingPrice] = useState('2500');
  const [vehicleType, setVehicleType] = useState('Mini Truck');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [animBars] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);

  const vehicles = ['Mini Truck', 'Large Truck', 'Shared'];

  const calculateProfit = async () => {
    setLoading(true);
    setResult(null);
    animBars.forEach(a => a.setValue(0));
    
    try {
      const res = await apiClient.post('/profit/calculate', {
        selling_price_per_qtl: parseFloat(sellingPrice) || 2500,
        quantity_quintals: 10,
        distance_km: 15,
        vehicle_type: vehicleType,
        marketplace_fee_pct: 2,
        other_costs: 0
      });
      setResult(res.data);
    } catch (e) {
      console.log('Using mock calculate result');
      setTimeout(() => {
        setResult({
          gross_revenue: (parseFloat(sellingPrice) || 2500) * 10,
          deductions: {
            transport: vehicleType === 'Shared' ? 800 : vehicleType === 'Mini Truck' ? 1200 : 2500,
            marketplace_fee: 500,
            loading_unloading: 500,
            cess: 250,
            other_costs: 0
          },
          total_deductions: 2450, // mock static value for calc simplicity
          net_income: ((parseFloat(sellingPrice) || 2500) * 10) - (vehicleType === 'Shared' ? 800 : vehicleType === 'Mini Truck' ? 1200 : 2500) - 1250,
          profit_margin_pct: 91.2,
          per_quintal: { selling_price: parseFloat(sellingPrice) || 2500, net_per_quintal: 2280 }
        });
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (result) {
      Animated.stagger(150, animBars.map(a => 
        Animated.timing(a, { toValue: 1, duration: 400, useNativeDriver: false })
      )).start();
    }
  }, [result]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.inputSection}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Selling Price (₹/qtl)</Text>
            <TextInput 
              style={styles.input}
              value={sellingPrice}
              onChangeText={setSellingPrice}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Quantity (qtl)</Text>
            <TextInput style={[styles.input, styles.inputDisabled]} value="10" editable={false} />
          </View>
        </View>

        <Text style={styles.label}>Vehicle Type</Text>
        <View style={styles.pillsRow}>
          {vehicles.map(v => (
            <TouchableOpacity 
              key={v} 
              style={[styles.pill, vehicleType === v && styles.pillActive]}
              onPress={() => setVehicleType(v)}
            >
              <Text style={[styles.pillText, vehicleType === v && styles.pillTextActive]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.calcBtn} onPress={calculateProfit}>
          <Text style={styles.calcBtnText}>{loading ? 'Calculating...' : 'Calculate'}</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Profit Breakdown</Text>
          
          <View style={styles.waterfall}>
            {/* Gross Revenue */}
            <View style={styles.wfRow}>
              <Animated.View style={[styles.wfBar, styles.wfBarGreen, { width: animBars[0].interpolate({inputRange: [0,1], outputRange: ['0%', '100%']}) }]} />
              <View style={styles.wfContent}>
                <Text style={styles.wfLabel}>Gross Revenue</Text>
                <Text style={styles.wfVal}>₹{result.gross_revenue.toLocaleString()}</Text>
              </View>
            </View>
            
            {/* Deductions */}
            <View style={styles.wfRow}>
              <Animated.View style={[styles.wfBar, styles.wfBarRed, { width: animBars[1].interpolate({inputRange: [0,1], outputRange: ['0%', `${(result.deductions.transport/result.gross_revenue)*100}%`]}) }]} />
              <View style={styles.wfContent}>
                <Text style={styles.wfLabel}>- Transport</Text>
                <Text style={styles.wfVal}>₹{result.deductions.transport.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.wfRow}>
              <Animated.View style={[styles.wfBar, styles.wfBarRed, { width: animBars[2].interpolate({inputRange: [0,1], outputRange: ['0%', `${(result.deductions.marketplace_fee/result.gross_revenue)*100}%`]}) }]} />
              <View style={styles.wfContent}>
                <Text style={styles.wfLabel}>- Market Fee</Text>
                <Text style={styles.wfVal}>₹{result.deductions.marketplace_fee.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.wfRow}>
              <Animated.View style={[styles.wfBar, styles.wfBarRed, { width: animBars[3].interpolate({inputRange: [0,1], outputRange: ['0%', `${(result.deductions.loading_unloading/result.gross_revenue)*100}%`]}) }]} />
              <View style={styles.wfContent}>
                <Text style={styles.wfLabel}>- Loading</Text>
                <Text style={styles.wfVal}>₹{result.deductions.loading_unloading.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.wfRow}>
              <Animated.View style={[styles.wfBar, styles.wfBarRed, { width: animBars[4].interpolate({inputRange: [0,1], outputRange: ['0%', `${(result.deductions.cess/result.gross_revenue)*100}%`]}) }]} />
              <View style={styles.wfContent}>
                <Text style={styles.wfLabel}>- Cess</Text>
                <Text style={styles.wfVal}>₹{result.deductions.cess.toLocaleString()}</Text>
              </View>
            </View>

            {/* Net Income */}
            <View style={[styles.wfRow, styles.wfRowFinal]}>
              <Animated.View style={[styles.wfBar, styles.wfBarGreen, { width: animBars[5].interpolate({inputRange: [0,1], outputRange: ['0%', `${(result.net_income/result.gross_revenue)*100}%`]}) }]} />
              <View style={styles.wfContent}>
                <Text style={styles.wfLabelFinal}>= Net Income</Text>
                <Text style={styles.wfValFinal}>₹{result.net_income.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TOTAL NET INCOME</Text>
            <Text style={[styles.summaryBig, { color: result.net_income > 0 ? colors.accent.emerald : colors.accent.rose }]}>
              ₹{result.net_income.toLocaleString()}
            </Text>
            
            <View style={styles.summaryFooter}>
              <View style={styles.sumFootCol}>
                <Text style={styles.sumFootLbl}>Margin</Text>
                <Text style={styles.sumFootVal}>{((result.net_income / result.gross_revenue)*100).toFixed(1)}%</Text>
              </View>
              <View style={styles.sumFootCol}>
                <Text style={styles.sumFootLbl}>Net per qtl</Text>
                <Text style={styles.sumFootVal}>₹{(result.net_income/10).toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  content: { padding: 16, paddingBottom: 40 },
  inputSection: { backgroundColor: colors.bg.card, padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: colors.bg.elevated },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  col: { flex: 1 },
  label: { color: colors.text.muted, fontSize: 12, textTransform: 'uppercase', marginBottom: 8, fontWeight: 'bold' },
  input: { backgroundColor: colors.bg.primary, borderWidth: 1, borderColor: colors.bg.elevated, height: 48, borderRadius: 8, color: colors.text.primary, paddingHorizontal: 12, fontSize: 16, fontWeight: 'bold' },
  inputDisabled: { color: colors.text.muted, backgroundColor: colors.bg.secondary },
  pillsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  pill: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8, backgroundColor: colors.bg.primary, borderWidth: 1, borderColor: colors.bg.elevated },
  pillActive: { borderColor: colors.accent.cyan, backgroundColor: `${colors.accent.cyan}22` },
  pillText: { color: colors.text.secondary, fontSize: 12, fontWeight: '600' },
  pillTextActive: { color: colors.accent.cyan, fontWeight: 'bold' },
  calcBtn: { backgroundColor: colors.accent.emerald, height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  calcBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  resultSection: { marginTop: 8 },
  sectionTitle: { color: colors.text.primary, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  waterfall: { gap: 8, marginBottom: 24 },
  wfRow: { height: 40, justifyContent: 'center', backgroundColor: colors.bg.secondary, borderRadius: 6, overflow: 'hidden' },
  wfRowFinal: { height: 50, marginTop: 8, borderTopWidth: 2, borderTopColor: colors.bg.elevated },
  wfBar: { position: 'absolute', top: 0, bottom: 0, left: 0 },
  wfBarGreen: { backgroundColor: `${colors.accent.emerald}33` },
  wfBarRed: { backgroundColor: `${colors.accent.rose}33` },
  wfContent: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, alignItems: 'center' },
  wfLabel: { color: colors.text.primary, fontSize: 14 },
  wfVal: { color: colors.text.primary, fontSize: 14, fontWeight: 'bold' },
  wfLabelFinal: { color: colors.text.primary, fontSize: 16, fontWeight: 'bold' },
  wfValFinal: { color: colors.accent.emerald, fontSize: 18, fontWeight: '900' },
  summaryCard: { backgroundColor: colors.bg.secondary, padding: 24, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.bg.elevated },
  summaryLabel: { color: colors.text.muted, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  summaryBig: { fontSize: 48, fontWeight: '900', marginBottom: 24 },
  summaryFooter: { flexDirection: 'row', width: '100%', borderTopWidth: 1, borderTopColor: colors.bg.elevated, paddingTop: 16 },
  sumFootCol: { flex: 1, alignItems: 'center' },
  sumFootLbl: { color: colors.text.muted, fontSize: 12, marginBottom: 4 },
  sumFootVal: { color: colors.text.primary, fontSize: 18, fontWeight: 'bold' },
});
