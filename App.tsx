import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './src/navigation/TabNavigator';
import { initDatabase } from './src/database';
import { Colors } from './src/constants/colors';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('🚀 Initializing Echo...');
        
        // Initialize database
        await initDatabase();
        console.log('✅ Database ready');
        
        // Add small delay to show splash
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsReady(true);
      } catch (e) {
        console.error('❌ Initialization failed:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    }

    prepare();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>❌ Error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎯 Echo</Text>
        <Text style={styles.subtitle}>Your Personal AI Companion</Text>
        <ActivityIndicator 
          size="large" 
          color={Colors.primary} 
          style={styles.loader} 
        />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <TabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  loader: {
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
