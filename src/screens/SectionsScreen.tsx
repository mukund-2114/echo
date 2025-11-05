import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { useNavigation } from '@react-navigation/native';

interface Item {
  key: string;
  icon: string;
  label: string;
  route: string;
}

const ITEMS: Item[] = [
  { key: 'dashboard', icon: '🏠', label: 'Home', route: 'Dashboard' },
  { key: 'mood', icon: '🎭', label: 'Mood', route: 'Mood' },
  { key: 'tasks', icon: '📅', label: 'Tasks', route: 'Tasks' },
  { key: 'learning', icon: '📚', label: 'Learning', route: 'Learning' },
  { key: 'sleep', icon: '😴', label: 'Sleep', route: 'Sleep' },
  { key: 'journal', icon: '📝', label: 'Journal', route: 'Journal' },
  { key: 'finance', icon: '💰', label: 'Finance', route: 'Finance' },
  { key: 'motivation', icon: '✨', label: 'Motivation', route: 'Motivation' },
  { key: 'settings', icon: '🛠️', label: 'Settings', route: 'Settings' },
];

export default function SectionsScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sections</Text>
      <Text style={styles.subtitle}>Tap a section to open</Text>
      <View style={styles.grid}>
        {ITEMS.map((it) => (
          <TouchableOpacity
            key={it.key}
            style={styles.tile}
            onPress={() => navigation.navigate(it.route as never)}
          >
            <Text style={styles.icon}>{it.icon}</Text>
            <Text style={styles.label}>{it.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    aspectRatio: 1.2,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: { fontSize: 32, marginBottom: 8 },
  label: { color: Colors.text, fontWeight: '700' },
});
