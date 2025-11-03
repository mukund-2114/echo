import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MoodType } from '@/types';
import { Colors } from '@/constants/colors';

interface MoodOption {
  type: MoodType;
  emoji: string;
  label: string;
  color: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { type: MoodType.GREAT, emoji: '😄', label: 'Great', color: Colors.moodGreat },
  { type: MoodType.NEUTRAL, emoji: '😐', label: 'Neutral', color: Colors.moodNeutral },
  { type: MoodType.LOW, emoji: '😔', label: 'Low', color: Colors.moodLow },
  { type: MoodType.STRESSED, emoji: '😰', label: 'Stressed', color: Colors.moodStressed },
  { type: MoodType.TIRED, emoji: '😴', label: 'Tired', color: Colors.moodTired },
];

interface MoodSelectorProps {
  selectedMood?: MoodType;
  onSelect: (mood: MoodType) => void;
}

export default function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      <View style={styles.moodGrid}>
        {MOOD_OPTIONS.map((mood) => (
          <TouchableOpacity
            key={mood.type}
            style={[
              styles.moodButton,
              selectedMood === mood.type && {
                backgroundColor: mood.color + '20',
                borderColor: mood.color,
                borderWidth: 2,
              },
            ]}
            onPress={() => onSelect(mood.type)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text
              style={[
                styles.label,
                selectedMood === mood.type && { color: mood.color, fontWeight: 'bold' },
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
