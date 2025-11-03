import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function IntensitySlider({ value, onChange }: IntensitySliderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intensity</Text>
      <View style={styles.buttonContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.button,
              value === num && styles.buttonActive,
            ]}
            onPress={() => onChange(num)}
          >
            <Text
              style={[
                styles.buttonText,
                value === num && styles.buttonTextActive,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Low</Text>
        <Text style={styles.value}>{value}/10</Text>
        <Text style={styles.label}>High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: Colors.textWhite,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
