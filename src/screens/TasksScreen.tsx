import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Colors } from '@/constants/colors';
import { scheduleTaskReminder } from '@/services/notifications';
import { Priority, Task } from '@/types';
import { taskRepository } from '@/database/repositories/TaskRepository';

const DEFAULT_USER_ID = 'user-1';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [title, setTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueQuick, setDueQuick] = useState<'none' | 'today' | 'tomorrow'>('none');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingPriority, setEditingPriority] = useState<Priority>(Priority.MEDIUM);
  const [editingDueQuick, setEditingDueQuick] = useState<'none' | 'today' | 'tomorrow'>('none');

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
      let dueDate: Date | undefined;
      if (dueQuick === 'today') {
        dueDate = new Date();
        dueDate.setHours(23, 59, 59, 999);
      } else if (dueQuick === 'tomorrow') {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 1);
        dueDate.setHours(23, 59, 59, 999);
      }

      const created = await taskRepository.create({ userId: DEFAULT_USER_ID, title: trimmed, priority, dueDate });
      // Schedule a reminder if a due date exists
      if (dueDate) {
        let trigger = new Date(dueDate);
        if (trigger.getHours() !== 0 || trigger.getMinutes() !== 0) {
          // If a time component exists, remind 30 minutes before
          trigger = new Date(dueDate);
          trigger.setMinutes(Math.max(0, trigger.getMinutes() - 30));
        } else {
          // Otherwise remind at 10:00 AM of due date
          trigger = new Date(dueDate);
          trigger.setHours(10, 0, 0, 0);
        }
        try { await scheduleTaskReminder(created, trigger); } catch {}
      }
      setTitle('');
      setPriority(Priority.MEDIUM);
      setDueQuick('none');
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

  const beginEdit = (t: Task) => {
    setEditingId(t.id);
    setEditingTitle(t.title);
    setEditingPriority(t.priority);
    let dq: 'none' | 'today' | 'tomorrow' = 'none';
    if (t.dueDate) {
      const today = new Date(); today.setHours(0,0,0,0);
      const endToday = new Date(today); endToday.setHours(23,59,59,999);
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      const endTomorrow = new Date(tomorrow); endTomorrow.setHours(23,59,59,999);
      if (t.dueDate >= today && t.dueDate <= endToday) dq = 'today';
      else if (t.dueDate >= tomorrow && t.dueDate <= endTomorrow) dq = 'tomorrow';
    }
    setEditingDueQuick(dq);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    let dueDate: Date | null = null;
    if (editingDueQuick === 'today') {
      dueDate = new Date();
      dueDate.setHours(23, 59, 59, 999);
    } else if (editingDueQuick === 'tomorrow') {
      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);
      dueDate.setHours(23, 59, 59, 999);
    }
    try {
      await taskRepository.update(editingId, { title: editingTitle.trim(), priority: editingPriority, dueDate: dueDate || undefined });
      // Reschedule reminder after edit if due date exists
      if (dueDate) {
        let trigger = new Date(dueDate);
        if (trigger.getHours() !== 0 || trigger.getMinutes() !== 0) {
          trigger = new Date(dueDate);
          trigger.setMinutes(Math.max(0, trigger.getMinutes() - 30));
        } else {
          trigger = new Date(dueDate);
          trigger.setHours(10, 0, 0, 0);
        }
        try {
          // Find updated task to pass to schedule
          const data = await taskRepository.findByUserId(DEFAULT_USER_ID, 200);
          const t = data.find(x => x.id === editingId);
          if (t) await scheduleTaskReminder(t, trigger);
        } catch {}
      }
      setEditingId(null);
      await load();
    } catch (e) {
      console.error('Update failed:', e);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
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
        <View style={styles.priorityGroup}>
          {([Priority.HIGH, Priority.MEDIUM, Priority.LOW] as Priority[]).map((p) => (
            <TouchableOpacity key={p} style={[styles.priorityPill, priority === p && styles.priorityPillActive]} onPress={() => setPriority(p)}>
              <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>{p[0].toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.dueGroup}>
          {(['none','today','tomorrow'] as const).map((opt) => (
            <TouchableOpacity key={opt} style={[styles.duePill, dueQuick === opt && styles.duePillActive]} onPress={() => setDueQuick(opt)}>
              <Text style={[styles.dueText, dueQuick === opt && styles.dueTextActive]}>{opt === 'none' ? '-' : opt === 'today' ? 'T' : 'T+1'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.addButton, (!title.trim() || adding) && styles.addButtonDisabled]} onPress={addTask} disabled={!title.trim() || adding}>
          <Text style={styles.addButtonText}>{adding ? '...' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <View style={styles.filterGroup}>
          {(['all','pending','completed'] as const).map((s) => (
            <TouchableOpacity key={s} style={[styles.filterPill, statusFilter === s && styles.filterPillActive]} onPress={() => setStatusFilter(s)}>
              <Text style={[styles.filterText, statusFilter === s && styles.filterTextActive]}>{s[0].toUpperCase() + s.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterGroup}>
          {(['all', Priority.HIGH, Priority.MEDIUM, Priority.LOW] as const).map((pf) => (
            <TouchableOpacity key={pf} style={[styles.filterPill, priorityFilter === pf && styles.filterPillActive]} onPress={() => setPriorityFilter(pf as any)}>
              <Text style={[styles.filterText, priorityFilter === pf && styles.filterTextActive]}>{pf === 'all' ? 'All' : (pf as string)[0].toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />
      ) : tasks.length === 0 ? (
        <Text style={styles.empty}>No tasks yet. Add your first one!</Text>
      ) : (
        tasks
          .filter((t) => statusFilter === 'all' ? true : (statusFilter === 'pending' ? t.status !== 'completed' : t.status === 'completed'))
          .filter((t) => priorityFilter === 'all' ? true : t.priority === priorityFilter)
          .map((t) => (
          <View key={t.id} style={styles.item}>
            <TouchableOpacity onPress={() => toggle(t.id, t.status === 'completed')} style={styles.checkbox}>
              <Text style={[styles.checkboxText, t.status === 'completed' && styles.checkboxChecked]}>{t.status === 'completed' ? '✓' : ''}</Text>
            </TouchableOpacity>
            <View style={styles.itemBody}>
              {editingId === t.id ? (
                <>
                  <TextInput
                    style={styles.editInput}
                    value={editingTitle}
                    onChangeText={setEditingTitle}
                    placeholder={t.title}
                    placeholderTextColor={Colors.textLight}
                  />
                  <View style={styles.inlineRow}>
                    <View style={styles.priorityGroup}>
                      {([Priority.HIGH, Priority.MEDIUM, Priority.LOW] as Priority[]).map((p) => (
                        <TouchableOpacity key={p} style={[styles.priorityPill, editingPriority === p && styles.priorityPillActive]} onPress={() => setEditingPriority(p)}>
                          <Text style={[styles.priorityText, editingPriority === p && styles.priorityTextActive]}>{p[0].toUpperCase()}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.dueGroup}>
                      {(['none','today','tomorrow'] as const).map((opt) => (
                        <TouchableOpacity key={opt} style={[styles.duePill, editingDueQuick === opt && styles.duePillActive]} onPress={() => setEditingDueQuick(opt)}>
                          <Text style={[styles.dueText, editingDueQuick === opt && styles.dueTextActive]}>{opt === 'none' ? '-' : opt === 'today' ? 'T' : 'T+1'}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <Text style={[styles.itemTitle, t.status === 'completed' && styles.itemTitleDone]}>{t.title}</Text>
                  <View style={styles.itemMetaRow}>
                    <Text style={styles.priorityBadge}>
                      {t.priority === 'high' ? '🔥 High' : t.priority === 'medium' ? '• Medium' : '↓ Low'}
                    </Text>
                    {t.dueDate ? <Text style={styles.itemMeta}> · Due {t.dueDate.toLocaleDateString()}</Text> : null}
                  </View>
                </>
              )}
            </View>
            {editingId === t.id ? (
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={saveEdit}>
                  <Text style={styles.save}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={cancelEdit}>
                  <Text style={styles.cancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => beginEdit(t)}>
                  <Text style={styles.edit}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => remove(t.id)}>
                  <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
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
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterGroup: {
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: 8,
  },
  filterPillActive: {
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.primary,
  },
  priorityGroup: {
    flexDirection: 'row',
    marginRight: 8,
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
    backgroundColor: Colors.surface,
  },
  priorityPillActive: {
    borderColor: Colors.primary,
  },
  priorityText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  priorityTextActive: {
    color: Colors.primary,
  },
  dueGroup: {
    flexDirection: 'row',
    marginRight: 8,
  },
  duePill: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
    backgroundColor: Colors.surface,
  },
  duePillActive: {
    borderColor: Colors.primary,
  },
  dueText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  dueTextActive: {
    color: Colors.primary,
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
  itemActions: {
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  edit: { color: Colors.info, fontWeight: '600', marginBottom: 6 },
  save: { color: Colors.success, fontWeight: '700', marginBottom: 6 },
  cancel: { color: Colors.textSecondary, fontWeight: '600' },
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
  editInput: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemMeta: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  priorityBadge: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  delete: {
    color: Colors.error,
    fontWeight: '600',
  },
});
