import { v4 as uuidv4 } from 'uuid';
import { MoodEntry, MoodType } from '@/types';
import { getDB } from '../index';

export class MoodRepository {
  private executeSql(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const db: any = getDB();
      db.transaction((tx: any) => {
        tx.executeSql(
          sql,
          params,
          (_: any, result: any) => resolve(result),
          (_: any, error: any) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async create(entry: Omit<MoodEntry, 'id' | 'createdAt'>): Promise<MoodEntry> {
    const id = uuidv4();
    const createdAt = new Date();
    
    const sql = `
      INSERT INTO mood_entries (
        id, user_id, mood_type, intensity, note, triggers, timestamp, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      entry.userId,
      entry.moodType,
      entry.intensity,
      entry.note || null,
      entry.triggers ? JSON.stringify(entry.triggers) : null,
      entry.timestamp.getTime(),
      createdAt.getTime(),
    ];
    
    await this.executeSql(sql, params);
    
    return {
      ...entry,
      id,
      createdAt,
    };
  }

  async findById(id: string): Promise<MoodEntry | null> {
    const sql = 'SELECT * FROM mood_entries WHERE id = ?';
    const result = await this.executeSql(sql, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToMoodEntry(result.rows.item(0));
  }

  async findByUserId(userId: string, limit: number = 50): Promise<MoodEntry[]> {
    const sql = `
      SELECT * FROM mood_entries 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    
    const result = await this.executeSql(sql, [userId, limit]);
    const entries: MoodEntry[] = [];
    
    for (let i = 0; i < result.rows.length; i++) {
      entries.push(this.mapRowToMoodEntry(result.rows.item(i)));
    }
    
    return entries;
  }

  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MoodEntry[]> {
    const sql = `
      SELECT * FROM mood_entries 
      WHERE user_id = ? 
        AND timestamp >= ? 
        AND timestamp <= ?
      ORDER BY timestamp DESC
    `;
    
    const result = await this.executeSql(sql, [
      userId,
      startDate.getTime(),
      endDate.getTime(),
    ]);
    
    const entries: MoodEntry[] = [];
    
    for (let i = 0; i < result.rows.length; i++) {
      entries.push(this.mapRowToMoodEntry(result.rows.item(i)));
    }
    
    return entries;
  }

  async getLatest(userId: string): Promise<MoodEntry | null> {
    const sql = `
      SELECT * FROM mood_entries 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;
    
    const result = await this.executeSql(sql, [userId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToMoodEntry(result.rows.item(0));
  }

  async getAverageMood(userId: string, days: number = 7): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const sql = `
      SELECT AVG(intensity) as avg_intensity 
      FROM mood_entries 
      WHERE user_id = ? 
        AND timestamp >= ?
    `;
    
    const result = await this.executeSql(sql, [userId, startDate.getTime()]);
    
    if (result.rows.length === 0) {
      return 0;
    }
    
    return result.rows.item(0).avg_intensity || 0;
  }

  async getMoodDistribution(userId: string, days: number = 30): Promise<Record<MoodType, number>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const sql = `
      SELECT mood_type, COUNT(*) as count 
      FROM mood_entries 
      WHERE user_id = ? 
        AND timestamp >= ?
      GROUP BY mood_type
    `;
    
    const result = await this.executeSql(sql, [userId, startDate.getTime()]);
    
    const distribution: Record<string, number> = {};
    
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      distribution[row.mood_type] = row.count;
    }
    
    return distribution as Record<MoodType, number>;
  }

  async update(id: string, updates: Partial<MoodEntry>): Promise<void> {
    const fields: string[] = [];
    const params: any[] = [];
    
    if (updates.moodType !== undefined) {
      fields.push('mood_type = ?');
      params.push(updates.moodType);
    }
    
    if (updates.intensity !== undefined) {
      fields.push('intensity = ?');
      params.push(updates.intensity);
    }
    
    if (updates.note !== undefined) {
      fields.push('note = ?');
      params.push(updates.note);
    }
    
    if (updates.triggers !== undefined) {
      fields.push('triggers = ?');
      params.push(JSON.stringify(updates.triggers));
    }
    
    if (fields.length === 0) {
      return;
    }
    
    params.push(id);
    
    const sql = `UPDATE mood_entries SET ${fields.join(', ')} WHERE id = ?`;
    await this.executeSql(sql, params);
  }

  async delete(id: string): Promise<void> {
    const sql = 'DELETE FROM mood_entries WHERE id = ?';
    await this.executeSql(sql, [id]);
  }

  async deleteByUserId(userId: string): Promise<void> {
    const sql = 'DELETE FROM mood_entries WHERE user_id = ?';
    await this.executeSql(sql, [userId]);
  }

  private mapRowToMoodEntry(row: any): MoodEntry {
    return {
      id: row.id,
      userId: row.user_id,
      moodType: row.mood_type as MoodType,
      intensity: row.intensity,
      note: row.note,
      triggers: row.triggers ? JSON.parse(row.triggers) : undefined,
      timestamp: new Date(row.timestamp),
      createdAt: new Date(row.created_at),
    };
  }
}

export const moodRepository = new MoodRepository();
