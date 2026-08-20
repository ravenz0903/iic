import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface GradeChipProps {
  grade: string;
}

export const GradeChip: React.FC<GradeChipProps> = ({ grade }) => {
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

  return (
    <View style={[styles.container, { backgroundColor: `${gradeColor}33` }]}>
      <Text style={[styles.text, { color: gradeColor }]}>
        Grade {grade}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
