import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';
import Card from '@/components/ui/Card';
import sleepService, { SleepSession } from '@/services/sleepService';
import { BarChart } from 'react-native-chart-kit';

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
  const screenPadding = 20;
  const chartWidth = Dimensions.get('window').width - screenPadding * 2 - 8; // card padding margin

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

  // Build last 7 days dataset (hours)
  const weeklyData = useMemo(() => {
    const now = new Date();
    const days: { label: string; totalMins: number }[] = [];
    // Start from 6 days ago to today
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toDateString();
      const label = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
      const totalMins = sessions
        .filter(s => s.wakeTime && new Date(s.wakeTime).toDateString() === key)
        .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
      days.push({ label, totalMins });
    }
    return {
      labels: days.map(d => d.label),
      data: days.map(d => Math.round((d.totalMins / 60) * 10) / 10), // hours with 0.1 precision
    };
  }, [sessions]);

  const goodSleep = (s: SleepSession) => {
    const enough = (s.durationMinutes ?? 0) >= 7 * 60;
    const quality = (s.qualityRating ?? 0) >= 4;
    return enough && quality;
  };

  return (
    <View style={styles.container}>
      <Card title="😴 This Week">
        <Text style={styles.row}>Weekly average: <Text style={styles.value}>{formatDuration(weeklyAvg)}</Text></Text>
        <View style={{ marginTop: 12 }}>
          <BarChart
            data={{ labels: weeklyData.labels, datasets: [{ data: weeklyData.data }] }}
            width={chartWidth}
            height={180}
            fromZero
            yAxisLabel=""
            yAxisSuffix="h"
            chartConfig={{
              backgroundGradientFrom: Colors.surface,
              backgroundGradientTo: Colors.surface,
              color: (o=1) => `rgba(59,130,246,${o})`,
              labelColor: () => Colors.textSecondary,
              decimalPlaces: 1,
              propsForBackgroundLines: { stroke: Colors.border },
              barPercentage: 0.6,
            }}
            style={{ borderRadius: 12 }}
            withInnerLines
            withHorizontalLabels
          />
        </View>
      </Card>

      <Card title="📜 Recent sessions">
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
