import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Card from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import { getDailyChallenge, getDailyMusic, getDailyQuote } from '@/utils/daily';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MotivationScreen() {
  const challenge = getDailyChallenge();
  const music = getDailyMusic();
  const quote = getDailyQuote();
  const [done, setDone] = useState(false);

  const keyForToday = () => {
    const d = new Date();
    return `motivation.done.${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    };

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem(keyForToday());
      setDone(v === '1');
    })();
  }, []);

  const markDone = async () => {
    await AsyncStorage.setItem(keyForToday(), '1');
    setDone(true);
  };

  return (
    <View style={styles.container}>
      <Card title="Daily challenge">
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.hint}>{challenge.hint}</Text>
        <TouchableOpacity
          style={[styles.primaryBtn, done && { opacity: 0.6 }]}
          onPress={markDone}
          disabled={done}
        >
          <Text style={styles.primaryText}>{done ? 'Completed' : 'Mark as done'}</Text>
        </TouchableOpacity>
      </Card>

      <Card title="Motivation">
        <Text style={styles.quote}>“{quote}”</Text>
      </Card>

      <Card title="Music for focus">
        <View style={styles.row}>
          <Text style={styles.musicLabel}>{music.label}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(music.url)}>
            <Text style={styles.link}>Play</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  hint: {
    color: Colors.textSecondary,
    marginTop: 6,
    marginBottom: 10,
  },
  primaryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  primaryText: {
    color: Colors.textWhite,
    fontWeight: '700',
  },
  quote: {
    color: Colors.text,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  musicLabel: {
    color: Colors.text,
  },
  link: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
