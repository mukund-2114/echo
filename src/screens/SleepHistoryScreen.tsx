import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors } from '@/constants/colors';
import Card from '@/components/ui/Card';
import sleepService, { SleepSession } from '@/services/sleepService';

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDuration(mins?: number) {
  if (!mins && mins !== 0) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function SleepHistoryScreen() {
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [weeklyAvg, setWeeklyAvg] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const hist = await sleepService.getSleepHistory('user-1', 30);
        setSessions(hist);
        const stats = await sleepService.getSleepStats('user-1');
        setWeeklyAvg(stats.weeklyAverage);
      } catch {}
    };
    load();
  }, []);

  const goodSleep = (s: SleepSession) => {
    const enough = (s.durationMinutes ?? 0) >= 7 * 60;
    const quality = (s.qualityRating ?? 0) >= 4;
    return enough && quality;
  };

  return (
    <View style={styles.container}>
      <Card title="This Week">
        <Text style={styles.row}>Weekly average: <Text style={styles.value}>{formatDuration(weeklyAvg)}</Text></Text>
      </Card>

      <Card title="Recent sessions">
        {sessions.length === 0 ? (
          <Text style={styles.row}>No sessions yet.</Text>
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{formatDate(item.sleepTime)}</Text>
                  <Text style={styles.itemMeta}>
                    {item.wakeTime ? `${new Date(item.sleepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → ${new Date(item.wakeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'In progress'}
                  </Text>
                </View>
                <View style={styles.badges}>
                  <Text style={styles.duration}>{formatDuration(item.durationMinutes)}</Text>
                  {goodSleep(item) && <Text style={styles.badge}>Good</Text>}
                  {item.qualityRating ? <Text style={styles.quality}>Q{item.qualityRating}</Text> : null}
                </View>
              </View>
            )}
          />
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: 8,
  },
  row: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  value: {
    color: Colors.text,
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemTitle: {
    color: Colors.text,
    fontWeight: '700',
  },
  itemMeta: {
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duration: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#16a34a',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    fontWeight: '700',
  },
  quality: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '700',
  },
});
