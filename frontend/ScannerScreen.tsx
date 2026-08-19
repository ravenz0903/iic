import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function ScannerScreen({ navigation }: any) {
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulating POST request to /vision
    setTimeout(() => {
      setQualityScore(85);
      setIsUploading(false);
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return '#4caf50'; // Green
    if (score >= 50) return '#ffeb3b'; // Yellow
    return '#f44336'; // Red
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Produce Scanner</Text>
      
      {!qualityScore ? (
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.uploadText}>Upload Produce Photo</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.resultContainer}>
          <View style={[styles.circle, { borderColor: getScoreColor(qualityScore) }]}>
            <Text style={[styles.scoreText, { color: getScoreColor(qualityScore) }]}>
              {qualityScore}
            </Text>
          </View>
          <Text style={styles.subtitle}>Quality Score</Text>
          
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={() => navigation.navigate('MarketMap', { qualityScore })}
          >
            <Text style={styles.nextText}>Find Best Markets</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
  },
  uploadButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  uploadText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#aaaaaa',
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: '#10b981',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  nextText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
