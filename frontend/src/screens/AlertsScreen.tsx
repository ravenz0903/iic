import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import apiClient from '../api/client';
import { Alert as AppAlert } from '../types';

export const AlertsScreen = ({ navigation }: any) => {
  const [alerts, setAlerts] = useState<AppAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Price', 'Buyers', 'Markets'];

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await apiClient.get('/alerts?produce_type=wheat');
      setAlerts(response.data);
    } catch (error) {
      console.log('Using mock alerts');
      setAlerts([
        {
          id: "1", type: "price_increase", severity: "positive", 
          title: "Wheat prices up 5.2% this week", 
          message: "Current average: ₹2,480/qtl", 
          timestamp: new Date().toISOString(),
          dismissed: false
        },
        {
          id: "2", type: "new_buyer", severity: "info", 
          title: "New buyer matched within 40km", 
          message: "Looking for Grade A wheat, ₹2,600/qtl", 
          timestamp: new Date(Date.now()-7200000).toISOString(),
          dismissed: false
        },
        {
          id: "3", type: "price_decrease", severity: "warning", 
          title: "Tomato demand declining", 
          message: "Market B reporting 12% lower demand", 
          timestamp: new Date(Date.now()-18000000).toISOString(),
          dismissed: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const getSeverityStyle = (severity: string) => {
    switch(severity) {
      case 'positive': return { icon: '🟢', color: colors.accent.emerald };
      case 'warning': return { icon: '🔴', color: colors.accent.rose };
      case 'info': default: return { icon: '🔵', color: colors.accent.cyan };
    }
  };

  const getRelativeTime = (isoString: string) => {
    const ms = Date.now() - new Date(isoString).getTime();
    const hrs = Math.floor(ms / 3600000);
    if (hrs === 0) return 'Just now';
    if (hrs < 24) return `${hrs} hours ago`;
    return `${Math.floor(hrs/24)} days ago`;
  };

  const renderItem = ({ item }: { item: AppAlert }) => {
    const { icon, color } = getSeverityStyle(item.severity);
    return (
      <View style={[styles.alertCard, { borderLeftColor: color }]}>
        <Text style={styles.alertIcon}>{icon}</Text>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <Text style={styles.alertMsg}>{item.message}</Text>
          <Text style={styles.alertTime}>{getRelativeTime(item.timestamp)}</Text>
        </View>
        <TouchableOpacity onPress={() => dismissAlert(item.id)} style={styles.dismissBtn}>
          <Text style={styles.dismissText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔔 Alerts</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>{alerts.length}</Text></View>
      </View>

      <View style={styles.filterTabs}>
        {filters.map(f => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent.emerald} style={{marginTop: 40}}/>
      ) : alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🌾</Text>
          <Text style={styles.emptyText}>All clear! No new alerts.</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: colors.bg.secondary },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.text.primary, marginRight: 12 },
  badge: { backgroundColor: colors.accent.rose, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  filterTabs: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.bg.elevated, gap: 12 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.bg.elevated },
  filterPillActive: { backgroundColor: colors.accent.emerald },
  filterText: { color: colors.text.secondary, fontWeight: '600' },
  filterTextActive: { color: '#000', fontWeight: 'bold' },
  listContent: { padding: 16, gap: 12 },
  alertCard: { backgroundColor: colors.bg.card, borderRadius: 12, padding: 16, flexDirection: 'row', borderLeftWidth: 4, elevation: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 4 },
  alertIcon: { fontSize: 24, marginRight: 12, marginTop: 2 },
  alertContent: { flex: 1 },
  alertTitle: { color: colors.text.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  alertMsg: { color: colors.text.secondary, fontSize: 14, marginBottom: 8, lineHeight: 20 },
  alertTime: { color: colors.text.muted, fontSize: 12 },
  dismissBtn: { padding: 4 },
  dismissText: { color: colors.text.muted, fontSize: 24, lineHeight: 24 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { color: colors.text.secondary, fontSize: 18, fontWeight: '500' },
});
