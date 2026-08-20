import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface ScoreRingProps {
  score: number;
  size?: number;
  grade: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ score, size = 180, grade }) => {
  const getGradeColor = () => {
    switch (grade) {
      case 'A': return colors.grade.A;
      case 'B': return colors.grade.B;
      case 'C': return colors.grade.C;
      case 'Rejected':
      default:
        return colors.grade.Rejected;
    }
  };

  const gradeColor = getGradeColor();
  const strokeWidth = Math.max(10, size * 0.05);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: gradeColor,
            borderWidth: strokeWidth,
            shadowColor: gradeColor,
          },
        ]}
      >
        <View style={styles.innerCircle}>
          <Text style={[styles.scoreText, { color: colors.text.primary }]}>
            {score.toFixed(1)}
          </Text>
          <Text style={[styles.gradeText, { color: gradeColor }]}>
            Grade {grade}
          </Text>
        </View>
      </View>
      <Text style={styles.label}>Quality Score</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '900',
    includeFontPadding: false,
  },
  gradeText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
