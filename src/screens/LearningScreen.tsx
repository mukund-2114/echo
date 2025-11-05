import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import Card from '@/components/ui/Card';
import vocabService, { VocabWord } from '@/services/vocabService';
import codingPromptService, { CodingPrompt } from '@/services/codingPromptService';

export default function LearningScreen() {
  const [loading, setLoading] = useState(true);
  const [word, setWord] = useState<VocabWord | null>(null);
  const [prompt, setPrompt] = useState<CodingPrompt | null>(null);
  const [working, setWorking] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      await vocabService.seedIfEmpty();
      await codingPromptService.seedIfEmpty();
      const w = await vocabService.getDailyWord();
      const p = await codingPromptService.getDailyPrompt();
      setWord(w);
      setPrompt(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Learning Hub</Text>
      <Text style={styles.subtitle}>Grow your skills</Text>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />
      ) : (
        <>
          <Card title="Word of the Day">
            {word ? (
              <>
                <Text style={styles.row}>Word: <Text style={styles.value}>{word.word}</Text></Text>
                <Text style={styles.row}>Meaning: <Text style={styles.value}>{word.definition}</Text></Text>
                {word.exampleSentence ? (
                  <Text style={styles.row}>Example: <Text style={styles.value}>{word.exampleSentence}</Text></Text>
                ) : null}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.primaryBtn, working && { opacity: 0.6 }]}
                    disabled={working || !!word.learned}
                    onPress={async () => {
                      setWorking(true);
                      try { await vocabService.markLearned(word.id); await load(); } finally { setWorking(false); }
                    }}
                  >
                    <Text style={styles.btnText}>{word.learned ? 'Learned ✅' : 'Mark learned'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text style={styles.row}>No words available.</Text>
            )}
          </Card>

          <Card title="Coding Prompt">
            {prompt ? (
              <>
                <Text style={styles.row}>Title: <Text style={styles.value}>{prompt.title}</Text></Text>
                <Text style={styles.row}>Difficulty: <Text style={styles.value}>{prompt.difficulty}</Text></Text>
                <Text style={[styles.row, { marginTop: 6 }]}>{prompt.description}</Text>
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.secondaryBtn, working && { opacity: 0.6 }]}
                    disabled={working || !!prompt.completed}
                    onPress={async () => {
                      setWorking(true);
                      try { await codingPromptService.markCompleted(prompt.id); await load(); } finally { setWorking(false); }
                    }}
                  >
                    <Text style={styles.secondaryBtnText}>{prompt.completed ? 'Completed ✅' : 'Mark completed'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text style={styles.row}>No prompts available.</Text>
            )}
          </Card>
        </>
      )}
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
    marginBottom: 12,
  },
  row: { fontSize: 16, color: Colors.textSecondary, marginTop: 6 },
  value: { color: Colors.text, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', marginTop: 10 },
  primaryBtn: { backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnText: { color: Colors.textWhite, fontWeight: '700' },
  secondaryBtn: { borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  secondaryBtnText: { color: Colors.text, fontWeight: '700' },
});
