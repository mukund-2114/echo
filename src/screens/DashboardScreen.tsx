import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useMood } from '@/context/MoodContext';
import Card from '@/components/ui/Card';

export default function DashboardScreen() {
  const { loading, latest, average7 } = useMood();

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <Text style={styles.heroTitle}>Echo</Text>
        <Text style={styles.heroSubtitle}>Your daily overview</Text>
      </LinearGradient>

      <Card title="Mood summary">
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
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  heroTitle: {
    color: Colors.textWhite,
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: Colors.textWhite,
    opacity: 0.9,
    marginTop: 4,
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
