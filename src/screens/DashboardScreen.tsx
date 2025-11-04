import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import { useMood } from '@/context/MoodContext';

export default function DashboardScreen() {
  const { loading, latest, average7 } = useMood();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Dashboard</Text>
      <Text style={styles.subtitle}>Your daily overview</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mood summary</Text>
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <>
            <Text style={styles.cardRow}>
              Latest: <Text style={styles.cardValue}>{latest ? `${latest.moodType} · ${latest.intensity}/10` : '—'}</Text>
            </Text>
            <Text style={styles.cardRow}>
              7-day avg: <Text style={styles.cardValue}>{average7 || 0}/10</Text>
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  cardRow: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  cardValue: {
    color: Colors.text,
    fontWeight: '600',
  },
});
