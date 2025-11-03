import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>🎯 Echo</Text>
      <Text style={styles.subtitle}>Your Personal AI Companion</Text>
      <Text style={styles.version}>v0.1.0 - MVP Development</Text>
      <View style={styles.status}>
        <Text style={styles.statusText}>✅ Project Initialized</Text>
        <Text style={styles.statusText}>⏳ Building Features...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#64748b',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 32,
  },
  status: {
    marginTop: 32,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#475569',
    marginVertical: 4,
  },
});
