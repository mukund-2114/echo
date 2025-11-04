import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { taskRepository } from '@/database/repositories/TaskRepository';
import { Task } from '@/types';

export async function initNotifications() {
  // Configure Android channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Request permissions
  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }
}

export async function scheduleDailyMotivation(hourLocal: number = 8) {
  // Schedule at today's or next day's specified hour
  const now = new Date();
  const at = new Date();
  at.setHours(hourLocal, 0, 0, 0);
  if (at <= now) at.setDate(at.getDate() + 1);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily boost',
      body: 'Open Echo for today\'s challenge, quote, and focus music.',
      sound: Platform.OS === 'android' ? undefined : 'default',
    },
    trigger: { date: at },
  });
}

export async function scheduleTaskRemindersForToday(userId: string = 'user-1') {
  // Fetch tasks and schedule reminders for due today (pending only)
  const tasks: Task[] = await taskRepository.findByUserId(userId, 200);
  const now = new Date();
  const start = new Date(now); start.setHours(0,0,0,0);
  const end = new Date(now); end.setHours(23,59,59,999);

  const pendingToday = tasks.filter((t) => t.status !== 'completed' && t.dueDate && t.dueDate >= start && t.dueDate <= end);

  for (const t of pendingToday) {
    // Schedule reminder at 30 minutes before due time if time component exists, else at 10:00 AM local
    let triggerDate = new Date();
    if (t.dueDate && (t.dueDate.getHours() !== 0 || t.dueDate.getMinutes() !== 0)) {
      triggerDate = new Date(t.dueDate);
      triggerDate.setMinutes(Math.max(0, triggerDate.getMinutes() - 30));
    } else {
      triggerDate = new Date();
      triggerDate.setHours(10, 0, 0, 0);
      if (triggerDate < now) triggerDate = now;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task due today',
        body: t.title,
        sound: Platform.OS === 'android' ? undefined : 'default',
      },
      trigger: { date: triggerDate },
    });
  }
}
