import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';
import { initNotifications, scheduleDailyMotivation } from '@/services/notifications';

const KEY_NOTIFS = 'settings.notificationsEnabled';
const KEY_BACKUP = 'settings.backupEnabled';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [backupEnabled, setBackupEnabled] = useState<boolean>(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const load = async () => {
      const n = await AsyncStorage.getItem(KEY_NOTIFS);
      const b = await AsyncStorage.getItem(KEY_BACKUP);
      setNotificationsEnabled(n === '1');
      setBackupEnabled(b === '1');
    };
    load();
  }, []);

  const toggleNotifications = async (val: boolean) => {
    setWorking(true);
    try {
      setNotificationsEnabled(val);
      await AsyncStorage.setItem(KEY_NOTIFS, val ? '1' : '0');
      if (val) {
        // Ask permission and schedule a friendly daily motivation by default
        await initNotifications();
        await scheduleDailyMotivation(8);
      }
    } finally {
      setWorking(false);
    }
  };

  const toggleBackup = async (val: boolean) => {
    setWorking(true);
    try {
      setBackupEnabled(val);
      await AsyncStorage.setItem(KEY_BACKUP, val ? '1' : '0');
      // The App initializer can check this flag to enable/disable cloud sync
    } finally {
      setWorking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>
      <Text style={styles.subtitle}>Control your preferences</Text>

      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Notifications</Text>
          <Text style={styles.desc}>Daily motivation and task reminders</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          disabled={working}
          trackColor={{ true: Colors.primary, false: Colors.border }}
          thumbColor={notificationsEnabled ? '#fff' : '#fff'}
        />
      </View>

      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Cloud Backup (Optional)</Text>
          <Text style={styles.desc}>Sync tasks to cloud when available</Text>
        </View>
        <Switch
          value={backupEnabled}
          onValueChange={toggleBackup}
          disabled={working}
          trackColor={{ true: Colors.primary, false: Colors.border }}
          thumbColor={backupEnabled ? '#fff' : '#fff'}
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, working && { opacity: 0.6 }]}
        onPress={async () => {
          setWorking(true);
          try {
            await AsyncStorage.multiRemove([KEY_NOTIFS, KEY_BACKUP]);
            setNotificationsEnabled(false);
            setBackupEnabled(false);
          } finally {
            setWorking(false);
          }
        }}
        disabled={working}
      >
        <Text style={styles.btnText}>Reset settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  label: { color: Colors.text, fontWeight: '700' },
  desc: { color: Colors.textSecondary, marginTop: 2 },
  btn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, alignSelf: 'flex-start', marginTop: 8 },
  btnText: { color: Colors.textWhite, fontWeight: '700' },
});
