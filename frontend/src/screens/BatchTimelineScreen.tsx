import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { GradientCard } from '../components/ui/GradientCard';
import apiClient from '../api/client';

export const BatchTimelineScreen = ({ route }: any) => {
  const batchId = route.params?.batch_id || 'BATCH#WH-2026-0820-0042';
  const [timeline, setTimeline] = useState<any[]>([]);
  const [cert, setCert] = useState<any>(null);
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Pulse animation for active step
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true })
      ])
    ).start();

    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const [tlRes, certRes] = await Promise.all([
        apiClient.get(`/batches/${encodeURIComponent(batchId)}/timeline`),
        apiClient.get(`/batches/${encodeURIComponent(batchId)}/certificate`)
      ]);
      setTimeline(tlRes.data.steps);
      setCert(certRes.data);
    } catch (e) {
      console.log('Mocking timeline data');
      setTimeout(() => {
        setCert({
          id: 'CERT-99482-2026',
          issue_date: new Date().toISOString(),
          produce: 'Wheat',
          quantity: '10 Quintals',
          variety: 'Sharbati',
          grade: 'A',
          score: 88.5
        });

        setTimeline([
          { id: 1, status: 'completed', label: 'Harvest Logged', actor: 'Ramesh Singh (Farmer)', location: 'Farm Plot A, Punjab', details: 'Harvested 10 quintals of Sharbati wheat.', time: new Date(Date.now()-86400000*2).toISOString() },
          { id: 2, status: 'completed', label: 'Quality Analyzed', actor: 'Agri AI Vision', location: 'Collection Center', details: 'Scanned via AI. Grade A assigned (88.5 score).', time: new Date(Date.now()-86400000*1).toISOString() },
          { id: 3, status: 'active', label: 'In Transit', actor: 'Logistics Partner', location: 'En route to Azadpur Mandi', details: 'Estimated arrival in 45 minutes.', time: new Date().toISOString() },
          { id: 4, status: 'pending', label: 'Market Arrival', actor: 'Azadpur Mandi Authority', location: 'Gate 4', details: 'Pending weighment and unloading.', time: null },
          { id: 5, status: 'pending', label: 'Sale Concluded', actor: 'Pending Buyer', location: '-', details: 'Payment clearing.', time: null }
        ]);
      }, 500);
    }
  };

  const getFormatTime = (iso: string | null) => {
    if (!iso) return '--:--';
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.batchId}>{batchId}</Text>
        <Text style={styles.subtitle}>Digital Traceability</Text>
      </View>

      {cert && (
        <GradientCard borderColor={colors.accent.cyan} style={styles.certCard}>
          <Text style={styles.certTitle}>📜 Digital Certificate</Text>
          <View style={styles.certGrid}>
            <View style={styles.certCol}><Text style={styles.certLbl}>Cert ID</Text><Text style={styles.certVal}>{cert.id}</Text></View>
            <View style={styles.certCol}><Text style={styles.certLbl}>Produce</Text><Text style={styles.certVal}>{cert.produce} ({cert.variety})</Text></View>
            <View style={styles.certCol}><Text style={styles.certLbl}>Quantity</Text><Text style={styles.certVal}>{cert.quantity}</Text></View>
            <View style={styles.certCol}><Text style={styles.certLbl}>Quality</Text><Text style={[styles.certVal, { color: colors.accent.emerald }]}>Grade {cert.grade}</Text></View>
          </View>
          <View style={styles.shareBtn}>
            <Text style={styles.shareText}>Share Certificate</Text>
          </View>
        </GradientCard>
      )}

      <View style={styles.timelineContainer}>
        {timeline.map((step, idx) => {
          const isLast = idx === timeline.length - 1;
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';
          const isPending = step.status === 'pending';

          const circleColor = isCompleted ? colors.accent.emerald : isActive ? colors.accent.cyan : colors.bg.elevated;
          const lineColor = isCompleted ? colors.accent.emerald : isActive ? colors.accent.cyan : colors.bg.elevated;

          return (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.stepVisuals}>
                {isActive ? (
                  <Animated.View style={[styles.circle, { backgroundColor: circleColor, opacity: pulseAnim }]}>
                    <Text style={styles.circleText}>•</Text>
                  </Animated.View>
                ) : (
                  <View style={[styles.circle, { backgroundColor: circleColor }]}>
                    <Text style={styles.circleText}>{isCompleted ? '✓' : step.id}</Text>
                  </View>
                )}
                {!isLast && (
                  <View style={[styles.line, { backgroundColor: lineColor, borderStyle: isPending ? 'dashed' : 'solid' }]} />
                )}
              </View>
              
              <View style={[styles.stepContent, isPending && { opacity: 0.5 }]}>
                <View style={styles.stepHeader}>
                  <Text style={[styles.stepLabel, { color: isCompleted || isActive ? colors.text.primary : colors.text.muted }]}>{step.label}</Text>
                  <Text style={styles.stepTime}>{getFormatTime(step.time)}</Text>
                </View>
                <Text style={styles.stepLocation}>📍 {step.location}</Text>
                <Text style={styles.stepActor}>👤 {step.actor}</Text>
                <Text style={styles.stepDetails}>{step.details}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.chainSection}>
        <Text style={styles.chainTitle}>Chain of Custody</Text>
        <View style={styles.chainCards}>
          <View style={styles.chainBox}><Text style={styles.chainIcon}>🧑‍🌾</Text><Text style={styles.chainText}>Farm</Text></View>
          <Text style={styles.chainArrow}>→</Text>
          <View style={styles.chainBox}><Text style={styles.chainIcon}>🔍</Text><Text style={styles.chainText}>Quality</Text></View>
          <Text style={styles.chainArrow}>→</Text>
          <View style={styles.chainBox}><Text style={styles.chainIcon}>🏬</Text><Text style={styles.chainText}>Market</Text></View>
          <Text style={styles.chainArrow}>→</Text>
          <View style={[styles.chainBox, { opacity: 0.3 }]}><Text style={styles.chainIcon}>🤝</Text><Text style={styles.chainText}>Buyer</Text></View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  content: { padding: 16, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  batchId: { color: colors.text.primary, fontSize: 18, fontFamily: 'monospace', fontWeight: 'bold' },
  subtitle: { color: colors.accent.cyan, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  certCard: { marginBottom: 32, padding: 16 },
  certTitle: { color: colors.text.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  certGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  certCol: { width: '45%', marginBottom: 8 },
  certLbl: { color: colors.text.muted, fontSize: 10, textTransform: 'uppercase', marginBottom: 2 },
  certVal: { color: colors.text.primary, fontSize: 14, fontWeight: '600' },
  shareBtn: { backgroundColor: `${colors.accent.cyan}22`, paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.accent.cyan },
  shareText: { color: colors.accent.cyan, fontWeight: 'bold' },
  timelineContainer: { paddingLeft: 8 },
  stepRow: { flexDirection: 'row', minHeight: 80 },
  stepVisuals: { width: 30, alignItems: 'center', marginRight: 16 },
  circle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  circleText: { color: '#000', fontSize: 12, fontWeight: 'bold' },
  line: { width: 2, flex: 1, marginVertical: 4 },
  stepContent: { flex: 1, paddingBottom: 24, paddingTop: 2 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  stepLabel: { fontSize: 16, fontWeight: 'bold' },
  stepTime: { color: colors.text.muted, fontSize: 10 },
  stepLocation: { color: colors.text.secondary, fontSize: 12, marginBottom: 2 },
  stepActor: { color: colors.text.secondary, fontSize: 12, marginBottom: 6 },
  stepDetails: { color: colors.text.muted, fontSize: 12, lineHeight: 18 },
  chainSection: { marginTop: 32, backgroundColor: colors.bg.secondary, padding: 16, borderRadius: 12 },
  chainTitle: { color: colors.text.primary, fontSize: 14, fontWeight: 'bold', marginBottom: 16 },
  chainCards: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chainBox: { alignItems: 'center', width: 50 },
  chainIcon: { fontSize: 24, marginBottom: 4 },
  chainText: { color: colors.text.secondary, fontSize: 10, fontWeight: '600' },
  chainArrow: { color: colors.text.muted, fontSize: 20 },
});
