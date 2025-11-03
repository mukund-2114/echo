import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { MoodType } from '@/types';
import MoodSelector from '@/components/mood/MoodSelector';
import IntensitySlider from '@/components/mood/IntensitySlider';
import { moodRepository } from '@/database/repositories/MoodRepository';

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<MoodType | undefined>();
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert('Select Mood', 'Please select how you\'re feeling');
      return;
    }

    setIsSaving(true);
    try {
      await moodRepository.create({
        userId: 'user-1', // TODO: Get from auth context
        moodType: selectedMood,
        intensity,
        note: note.trim() || undefined,
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Mood logged successfully!');
      
      // Reset form
      setSelectedMood(undefined);
      setIntensity(5);
      setNote('');
    } catch (error) {
      console.error('Failed to save mood:', error);
      Alert.alert('Error', 'Failed to save mood. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <MoodSelector
          selectedMood={selectedMood}
          onSelect={setSelectedMood}
        />

        {selectedMood && (
          <>
            <IntensitySlider
              value={intensity}
              onChange={setIntensity}
            />

            <View style={styles.noteSection}>
              <Text style={styles.noteTitle}>Add a note (optional)</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="What's on your mind?"
                placeholderTextColor={Colors.textLight}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Log Mood'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  noteSection: {
    padding: 20,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  noteInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
