import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Colors } from '@/constants/colors';
import { Task } from '@/types';
import { taskRepository } from '@/database/repositories/TaskRepository';

const DEFAULT_USER_ID = 'user-1';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [title, setTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await taskRepository.findByUserId(DEFAULT_USER_ID, 100);
      setTasks(data);
    } catch (e) {
      console.error('Failed to load tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const addTask = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setAdding(true);
    try {
      await taskRepository.create({ userId: DEFAULT_USER_ID, title: trimmed });
      setTitle('');
      await load();
    } catch (e) {
      console.error('Failed to add task:', e);
    } finally {
      setAdding(false);
    }
  };

  const toggle = async (id: string, completed: boolean) => {
    try {
      await taskRepository.toggleComplete(id, !completed);
      await load();
    } catch (e) {
      console.error('Toggle failed:', e);
    }
  };

  const remove = async (id: string) => {
    try {
      await taskRepository.delete(id);
      await load();
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}>
      <Text style={styles.title}>📅 Tasks</Text>
      <Text style={styles.subtitle}>Your to-do list</Text>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          placeholderTextColor={Colors.textLight}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity style={[styles.addButton, (!title.trim() || adding) && styles.addButtonDisabled]} onPress={addTask} disabled={!title.trim() || adding}>
          <Text style={styles.addButtonText}>{adding ? '...' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />
      ) : tasks.length === 0 ? (
        <Text style={styles.empty}>No tasks yet. Add your first one!</Text>
      ) : (
        tasks.map((t) => (
          <View key={t.id} style={styles.item}>
            <TouchableOpacity onPress={() => toggle(t.id, t.status === 'completed')} style={styles.checkbox}>
              <Text style={[styles.checkboxText, t.status === 'completed' && styles.checkboxChecked]}>{t.status === 'completed' ? '✓' : ''}</Text>
            </TouchableOpacity>
            <View style={styles.itemBody}>
              <Text style={[styles.itemTitle, t.status === 'completed' && styles.itemTitleDone]}>{t.title}</Text>
              {t.dueDate ? <Text style={styles.itemMeta}>Due {t.dueDate.toLocaleDateString()}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => remove(t.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
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
    marginBottom: 16,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: Colors.textWhite,
    fontWeight: '600',
  },
  empty: {
    color: Colors.textSecondary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxText: {
    color: Colors.textWhite,
  },
  checkboxChecked: {
    color: Colors.primary,
  },
  itemBody: {
    flex: 1,
  },
  itemTitle: {
    color: Colors.text,
    fontSize: 16,
  },
  itemTitleDone: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  itemMeta: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  delete: {
    color: Colors.error,
    fontWeight: '600',
  },
});
