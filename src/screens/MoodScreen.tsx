import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/colors';
import { MoodEntry, MoodType } from '@/types';
import MoodSelector from '@/components/mood/MoodSelector';
import IntensitySlider from '@/components/mood/IntensitySlider';
import { moodRepository } from '@/database/repositories/MoodRepository';

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<MoodType | undefined>();
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadRecent = async () => {
    try {
      setLoadingHistory(true);
      const entries = await moodRepository.findByUserId('user-1', 10);
      setRecentEntries(entries);
    } catch (error) {
      console.error('Failed to load recent moods:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadRecent();
  }, []);

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
      // Refresh recent list
      loadRecent();
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

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent moods</Text>
          {loadingHistory ? (
            <ActivityIndicator color={Colors.primary} />
          ) : recentEntries.length === 0 ? (
            <Text style={styles.historyEmpty}>No moods logged yet.</Text>
          ) : (
            recentEntries.map((entry) => (
              <View key={entry.id} style={styles.historyItem}>
                <View style={styles.historyRow}>
                  <Text style={styles.historyMood}>{entry.moodType}</Text>
                  <Text style={styles.historyIntensity}>Intensity {entry.intensity}/10</Text>
                </View>
                <Text style={styles.historyDate}>
                  {new Date(entry.timestamp).toLocaleString()}
                </Text>
                {entry.note ? (
                  <Text style={styles.historyNote}>{entry.note}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        {recentEntries.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.historyTitle}>Last 7 entries</Text>
            <LineChart
              data={{
                labels: recentEntries
                  .slice(0, 7)
                  .reverse()
                  .map((e) => new Date(e.timestamp).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })),
                datasets: [
                  {
                    data: recentEntries
                      .slice(0, 7)
                      .reverse()
                      .map((e) => e.intensity),
                    color: () => Colors.primary,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 40}
              height={180}
              chartConfig={{
                backgroundGradientFrom: Colors.surface,
                backgroundGradientTo: Colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: () => Colors.textSecondary,
                propsForDots: {
                  r: '3',
                  strokeWidth: '1',
                  stroke: Colors.primary,
                },
                propsForBackgroundLines: {
                  stroke: Colors.border,
                },
              }}
              bezier
              style={styles.chart}
              withInnerLines
              fromZero
              yAxisSuffix=""
            />
          </View>
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
  historySection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  historyEmpty: {
    color: Colors.textSecondary,
  },
  historyItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyMood: {
    fontSize: 16,
    color: Colors.text,
    textTransform: 'capitalize',
  },
  historyIntensity: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  historyDate: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  historyNote: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.text,
  },
  chartSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
});
