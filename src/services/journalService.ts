import { getDB } from '@/database';

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  moodEmoji?: string;
  moodRating?: number;
  tags?: string; // JSON array string
  createdAt: number;
  updatedAt: number;
}

class JournalService {
  create(userId: string, content: string, moodEmoji?: string, moodRating?: number, tags?: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const db = getDB();
      const id = `journal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const now = Date.now();
      const tagsJson = tags && tags.length ? JSON.stringify(tags) : null;

      db.transaction(
        (tx) => {
          tx.executeSql(
            `INSERT INTO journal_entries (id, user_id, content, mood_emoji, mood_rating, tags, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, userId, content, moodEmoji || null, moodRating || null, tagsJson, now, now],
            () => resolve(id),
            (_, err) => {
              reject(err);
              return false;
            }
          );
        },
        (e) => reject(e)
      );
    });
  }

  list(userId: string, limit: number = 50, offset: number = 0): Promise<JournalEntry[]> {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [userId, limit, offset],
            (_, res) => {
              const arr: JournalEntry[] = [];
              for (let i = 0; i < res.rows.length; i++) {
                const r = res.rows.item(i);
                arr.push({
                  id: r.id,
                  userId: r.user_id,
                  content: r.content,
                  moodEmoji: r.mood_emoji || undefined,
                  moodRating: r.mood_rating || undefined,
                  tags: r.tags || undefined,
                  createdAt: r.created_at,
                  updatedAt: r.updated_at,
                });
              }
              resolve(arr);
            },
            (_, err) => {
              reject(err);
              return false;
            }
          );
        },
        (e) => reject(e)
      );
    });
  }

  update(id: string, content: string, moodEmoji?: string, moodRating?: number, tags?: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = getDB();
      const now = Date.now();
      const tagsJson = tags && tags.length ? JSON.stringify(tags) : null;
      db.transaction(
        (tx) => {
          tx.executeSql(
            `UPDATE journal_entries SET content = ?, mood_emoji = ?, mood_rating = ?, tags = ?, updated_at = ? WHERE id = ?`,
            [content, moodEmoji || null, moodRating || null, tagsJson, now, id],
            () => resolve(),
            (_, err) => { reject(err); return false; }
          );
        },
        (e) => reject(e)
      );
    });
  }

  delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.transaction(
        (tx) => {
          tx.executeSql(
            `DELETE FROM journal_entries WHERE id = ?`,
            [id],
            () => resolve(),
            (_, err) => { reject(err); return false; }
          );
        },
        (e) => reject(e)
      );
    });
  }
}

export default new JournalService();
