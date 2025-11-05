import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '@/constants/colors';
import journalService, { JournalEntry } from '@/services/journalService';

const USER_ID = 'user-1';

const MOODS = ['😀','🙂','😐','🙁','😢','😴','🤒','😤','🤗','🤩'];

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState<string | undefined>(undefined);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [filterText, setFilterText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingEmoji, setEditingEmoji] = useState<string | undefined>(undefined);
  const [editingRating, setEditingRating] = useState<number | undefined>(undefined);
  const [editingTags, setEditingTags] = useState<string>('');

  const load = async () => {
    try {
      const list = await journalService.list(USER_ID, 50);
      setEntries(list);
    } catch (e) {
      console.warn('Failed to load journal:', e);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    const content = text.trim();
    if (!content) return;
    setSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      await journalService.create(USER_ID, content, emoji, rating, tags);
      setText('');
      setEmoji(undefined);
      setRating(undefined);
      setTagsInput('');
      await load();
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = (e: JournalEntry) => {
    setEditingId(e.id);
    setEditingText(e.content);
    setEditingEmoji(e.moodEmoji);
    setEditingRating(e.moodRating);
    try {
      const parsed = e.tags ? JSON.parse(e.tags) as string[] : [];
      setEditingTags(parsed.join(', '));
    } catch {
      setEditingTags('');
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const tags = editingTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      await journalService.update(editingId, editingText.trim(), editingEmoji, editingRating, tags);
      setEditingId(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    setSaving(true);
    try {
      await journalService.delete(id);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const filteredEntries = useMemo(() => {
    const f = filterText.trim().toLowerCase();
    if (!f) return entries;
    return entries.filter((e) => {
      const inText = e.content.toLowerCase().includes(f);
      let inTags = false;
      try {
        const tags = e.tags ? (JSON.parse(e.tags) as string[]) : [];
        inTags = tags.some((t) => t.toLowerCase().includes(f));
      } catch {}
      return inText || inTags;
    });
  }, [entries, filterText]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Journal</Text>
      <Text style={styles.subtitle}>Log a quick note with mood</Text>

      <View style={styles.moodRow}>
        <Text style={styles.label}>Mood:</Text>
        <View style={styles.moodChips}>
          {MOODS.map((m) => (
            <TouchableOpacity key={m} onPress={() => setEmoji(m)} style={[styles.moodChip, emoji === m && styles.moodChipActive]}>
              <Text style={styles.moodChipText}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.moodRow}>
        <Text style={styles.label}>Rating:</Text>
        <View style={styles.moodChips}>
          {[1,2,3,4,5].map((r) => (
            <TouchableOpacity key={r} onPress={() => setRating(r)} style={[styles.ratingChip, rating === r && styles.ratingChipActive]}>
              <Text style={styles.ratingChipText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor={Colors.textLight}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TextInput
          style={[styles.input, { marginTop: 8 }]}
          placeholder="tags (comma separated)"
          placeholderTextColor={Colors.textLight}
          value={tagsInput}
          onChangeText={setTagsInput}
        />
        <TouchableOpacity style={[styles.addButton, (!text.trim() || saving) && styles.addButtonDisabled]} onPress={add} disabled={!text.trim() || saving}>
          <Text style={styles.addButtonText}>{saving ? '...' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by text or tag"
          placeholderTextColor={Colors.textLight}
          value={filterText}
          onChangeText={setFilterText}
        />
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingTop: 8 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{new Date(item.createdAt).toLocaleString()}</Text>
              {editingId === item.id ? (
                <>
                  <TextInput
                    style={styles.editInput}
                    value={editingText}
                    onChangeText={setEditingText}
                    placeholderTextColor={Colors.textLight}
                    multiline
                  />
                  <View style={styles.moodRow}>
                    <Text style={styles.label}>Mood:</Text>
                    <View style={styles.moodChips}>
                      {MOODS.map((m) => (
                        <TouchableOpacity key={m} onPress={() => setEditingEmoji(m)} style={[styles.moodChip, editingEmoji === m && styles.moodChipActive]}>
                          <Text style={styles.moodChipText}>{m}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={styles.moodRow}>
                    <Text style={styles.label}>Rating:</Text>
                    <View style={styles.moodChips}>
                      {[1,2,3,4,5].map((r) => (
                        <TouchableOpacity key={r} onPress={() => setEditingRating(r)} style={[styles.ratingChip, editingRating === r && styles.ratingChipActive]}>
                          <Text style={styles.ratingChipText}>{r}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <TextInput
                    style={styles.editInput}
                    placeholder="tags (comma separated)"
                    placeholderTextColor={Colors.textLight}
                    value={editingTags}
                    onChangeText={setEditingTags}
                  />
                </>
              ) : (
                <Text style={styles.itemContent}>{item.content}</Text>
              )}
            </View>
            <View style={styles.badges}>
              {item.moodEmoji ? <Text style={styles.badge}>{item.moodEmoji}</Text> : null}
              {item.moodRating ? <Text style={styles.badge}>R{item.moodRating}</Text> : null}
            </View>
            <View style={styles.itemActions}>
              {editingId === item.id ? (
                <>
                  <TouchableOpacity onPress={saveEdit}>
                    <Text style={styles.save}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingId(null)}>
                    <Text style={styles.cancel}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => beginEdit(item)}>
                    <Text style={styles.edit}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => remove(item.id)}>
                    <Text style={styles.delete}>Delete</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  moodRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { color: Colors.textSecondary, width: 60 },
  moodChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodChip: { borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  moodChipActive: { borderColor: Colors.primary },
  moodChipText: { fontSize: 18 },
  ratingChip: { borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6 },
  ratingChipActive: { borderColor: Colors.primary },
  ratingChipText: { color: Colors.text, fontWeight: '700' },
  addRow: { marginTop: 8, marginBottom: 10 },
  input: { flex: 1, backgroundColor: Colors.surface, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, color: Colors.text, padding: 12, marginRight: 8 },
  addButton: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  addButtonDisabled: { opacity: 0.6 },
  addButtonText: { color: Colors.textWhite, fontWeight: '700' },
  filterRow: { marginBottom: 8 },
  filterInput: { backgroundColor: Colors.surface, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, color: Colors.text, padding: 10 },
  item: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 10 },
  itemTitle: { color: Colors.textSecondary, fontSize: 12, marginBottom: 6 },
  itemContent: { color: Colors.text, fontSize: 16 },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 8 },
  badge: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, color: Colors.text, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, fontWeight: '700' },
  itemActions: { marginLeft: 8, alignItems: 'flex-end' },
  edit: { color: Colors.info, fontWeight: '600', marginBottom: 6 },
  save: { color: Colors.success, fontWeight: '700', marginBottom: 6 },
  cancel: { color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  delete: { color: Colors.error, fontWeight: '600' },
  editInput: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, color: Colors.text, padding: 10, marginBottom: 8 },
});
