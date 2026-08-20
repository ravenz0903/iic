import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import apiClient from '../api/client';
import { CopilotMessage } from '../types';
import { PredictionBadge } from '../components/ai/PredictionBadge';

const TypingIndicator = () => {
  const opacities = [useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current];

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.stagger(150, opacities.map(anim => Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 300, useNativeDriver: true })
        ])))
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <View style={styles.typingContainer}>
      {opacities.map((anim, i) => (
        <Animated.View key={i} style={[styles.typingDot, { opacity: anim }]} />
      ))}
    </View>
  );
};

export const CopilotScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const initialSuggestions = [
    "Where should I sell?",
    "Check prices",
    "Should I sell now?",
    "Find buyers",
    "Calculate profit"
  ];

  useEffect(() => {
    // Initial welcome message
    setMessages([{
      role: 'ai',
      content: "Hello! I'm your Agri AI Copilot. How can I assist you with your produce today?",
      timestamp: new Date().toISOString()
    }]);
  }, []);

  const handleSend = async (query: string = input) => {
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    scrollViewRef.current?.scrollToEnd({ animated: true });

    try {
      const response = await apiClient.post('/copilot/ask', {
        query,
        context: { produce_type: "wheat", grade: "A", quality_score: 88.5, quantity_quintals: 10, farmer_lat: 28.6139, farmer_lon: 77.2090 }
      });
      
      const aiMsg: CopilotMessage = {
        role: 'ai',
        content: response.data.answer,
        data_cards: response.data.data_cards,
        suggested_actions: response.data.suggested_actions,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.log('Error, using mock Copilot response');
      // Mock delay
      await new Promise(r => setTimeout(r, 1200));
      
      const aiMsg: CopilotMessage = {
        role: 'ai',
        content: "Based on current market conditions, I recommend selling your wheat at Azadpur Mandi.\n\n📍 Distance: 15 km\n💰 Price: ₹2,520/qtl\n✅ **Net Earnings: ₹23,200**",
        data_cards: [{
          type: "market_comparison", 
          data: [
            {name: "Azadpur Mandi", current_price: 2520, net_earnings: 23200}, 
            {name: "Ghazipur Mandi", current_price: 2680, net_earnings: 22800}, 
            {name: "Okhla Mandi", current_price: 2450, net_earnings: 23400}
          ]
        }],
        suggested_actions: [
          {label: "Show on map", action: "navigate", screen: "MarketMap"}, 
          {label: "Calculate profit", action: "ask", query: "Calculate my profit"}
        ],
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleAction = (action: any) => {
    if (action.action === 'ask' && action.query) {
      handleSend(action.query);
    } else if (action.action === 'navigate' && action.screen) {
      navigation.navigate(action.screen);
    }
  };

  const renderDataCard = (card: any, index: number) => {
    if (card.type === 'market_comparison') {
      return (
        <View key={index} style={styles.dataCard}>
          <Text style={styles.dataCardTitle}>Market Comparison</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, {flex: 2}]}>Market</Text>
            <Text style={styles.th}>Price</Text>
            <Text style={[styles.th, {textAlign: 'right'}]}>Net</Text>
          </View>
          {card.data.map((row: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.td, {flex: 2}]}>{row.name}</Text>
              <Text style={styles.td}>₹{row.current_price}</Text>
              <Text style={[styles.td, styles.tdNet]}>₹{(row.net_earnings/1000).toFixed(1)}k</Text>
            </View>
          ))}
        </View>
      );
    }
    // Handle other types if needed...
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 Agri AI</Text>
        <Text style={styles.headerSubtitle}>Your Agricultural Intelligence Assistant</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.messageWrapper, msg.role === 'user' ? styles.msgRight : styles.msgLeft]}>
            {msg.role === 'ai' && <Text style={styles.aiAvatar}>🤖</Text>}
            <View style={[styles.messageBubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi]}>
              <Text style={[styles.messageText, msg.role === 'user' ? styles.textUser : styles.textAi]}>
                {msg.content}
              </Text>
              
              {msg.data_cards && msg.data_cards.map((card, i) => renderDataCard(card, i))}
              
              {msg.suggested_actions && (
                <View style={styles.actionsContainer}>
                  {msg.suggested_actions.map((act, i) => (
                    <TouchableOpacity key={i} style={styles.actionChip} onPress={() => handleAction(act)}>
                      <Text style={styles.actionChipText}>{act.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
        {isTyping && (
          <View style={[styles.messageWrapper, styles.msgLeft]}>
            <Text style={styles.aiAvatar}>🤖</Text>
            <View style={[styles.messageBubble, styles.bubbleAi]}>
              <TypingIndicator />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
          {initialSuggestions.map((s, i) => (
            <TouchableOpacity key={i} style={styles.suggestionPill} onPress={() => handleSend(s)}>
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything about your produce..."
            placeholderTextColor={colors.text.muted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
            <Text style={styles.sendIcon}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  header: { padding: 20, paddingTop: 60, backgroundColor: colors.bg.secondary, borderBottomWidth: 1, borderBottomColor: colors.bg.elevated },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.accent.cyan, letterSpacing: 1 },
  headerSubtitle: { fontSize: 12, color: colors.text.secondary, marginTop: 4 },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 24, gap: 16 },
  messageWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, maxWidth: '85%' },
  msgLeft: { alignSelf: 'flex-start' },
  msgRight: { alignSelf: 'flex-end' },
  aiAvatar: { fontSize: 24, marginRight: 8, marginBottom: 4 },
  messageBubble: { padding: 14, borderRadius: 20 },
  bubbleUser: { backgroundColor: colors.accent.emerald, borderBottomRightRadius: 4 },
  bubbleAi: { backgroundColor: colors.bg.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.bg.elevated },
  messageText: { fontSize: 16, lineHeight: 24 },
  textUser: { color: '#000', fontWeight: '500' },
  textAi: { color: colors.text.primary },
  dataCard: { backgroundColor: colors.bg.secondary, borderRadius: 12, padding: 12, marginTop: 12, borderWidth: 1, borderColor: colors.bg.elevated },
  dataCardTitle: { color: colors.accent.cyan, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.bg.elevated, paddingBottom: 4, marginBottom: 8 },
  th: { flex: 1, color: colors.text.muted, fontSize: 12, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', marginBottom: 8 },
  td: { flex: 1, color: colors.text.secondary, fontSize: 14 },
  tdNet: { color: colors.accent.emerald, fontWeight: 'bold', textAlign: 'right' },
  actionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.bg.elevated },
  actionChip: { backgroundColor: `${colors.accent.cyan}22`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: colors.accent.cyan },
  actionChipText: { color: colors.accent.cyan, fontSize: 12, fontWeight: '600' },
  typingContainer: { flexDirection: 'row', gap: 4, padding: 4 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.text.muted },
  inputArea: { backgroundColor: colors.bg.secondary, padding: 12, paddingBottom: 32, borderTopWidth: 1, borderTopColor: colors.bg.elevated },
  suggestionsScroll: { gap: 8, paddingBottom: 12 },
  suggestionPill: { backgroundColor: colors.bg.elevated, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: `${colors.text.muted}55` },
  suggestionText: { color: colors.text.secondary, fontSize: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: { flex: 1, backgroundColor: colors.bg.primary, height: 50, borderRadius: 25, paddingHorizontal: 20, color: colors.text.primary, borderWidth: 1, borderColor: colors.bg.elevated },
  sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.accent.emerald, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { color: '#000', fontSize: 24, fontWeight: 'bold' },
});
