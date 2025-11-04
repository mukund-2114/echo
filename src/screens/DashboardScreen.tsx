import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useMood } from '@/context/MoodContext';
import Card from '@/components/ui/Card';
import { taskRepository } from '@/database/repositories/TaskRepository';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const { loading, latest, average7 } = useMood();
  const navigation = useNavigation();
  const [pendingCount, setPendingCount] = useState(0);
  const [dueTodayCount, setDueTodayCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const tasks = await taskRepository.findByUserId('user-1', 200);
        const now = new Date();
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        const pending = tasks.filter((t) => t.status !== 'completed');
        const dueToday = pending.filter((t) => t.dueDate && t.dueDate >= start && t.dueDate <= end);
        setPendingCount(pending.length);
        setDueTodayCount(dueToday.length);
      } catch (e) {
        // Swallow for dashboard
      }
    };
    load();
  }, []);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <Text style={styles.heroTitle}>{greet()}</Text>
        <Text style={styles.heroSubtitle}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>{dueTodayCount}</Text>
            <Text style={styles.statLabel}>Due today</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Mood' as never)}>
            <Text style={styles.actionText}>Log mood</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnOutline} onPress={() => navigation.navigate('Tasks' as never)}>
            <Text style={styles.actionTextOutline}>Add task</Text>
          </TouchableOpacity>
        </View>
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
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  statPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 10,
  },
  statNumber: {
    color: Colors.textWhite,
    fontWeight: '800',
    fontSize: 16,
  },
  statLabel: {
    color: Colors.textWhite,
    opacity: 0.9,
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  actionBtn: {
    backgroundColor: Colors.textWhite,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
  },
  actionText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  actionBtnOutline: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  actionTextOutline: {
    color: Colors.textWhite,
    fontWeight: '700',
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
