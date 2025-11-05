// Sleep Tracking Service for Echo App
// Simplified version following existing database patterns

import { getDB } from '../database';

export interface SleepSession {
  id: string;
  userId: string;
  sleepTime: number;
  wakeTime?: number;
  durationMinutes?: number;
  qualityRating?: number; // 1-5 scale
  notes?: string;
  moodBeforeSleep?: string;
  moodAfterWake?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SleepStats {
  averageDuration: number;
  averageQuality: number;
  totalSessions: number;
  currentStreak: number;
  weeklyAverage: number;
}

class SleepService {
  /**
   * Start a new sleep session
   */
  startSleepSession(
    userId: string,
    moodBeforeSleep?: string,
    notes?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const db = getDB();
      const sessionId = `sleep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();

      db.transaction(
        (tx) => {
          // Check for active session first
          tx.executeSql(
            'SELECT id FROM sleep_sessions WHERE user_id = ? AND wake_time IS NULL LIMIT 1',
            [userId],
            (_, result) => {
              if (result.rows.length > 0) {
                reject(new Error('Active sleep session already exists'));
                return;
              }

              // Insert new sleep session
              tx.executeSql(
                `INSERT INTO sleep_sessions 
                 (id, user_id, sleep_time, mood_before_sleep, notes, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [sessionId, userId, now, moodBeforeSleep || null, notes || null, now, now],
                () => {
                  console.log('Sleep session started:', sessionId);
                  resolve(sessionId);
                },
                (_, error) => {
                  reject(error);
                  return false;
                }
              );
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (error) => reject(error)
      );
    });
  }

  /**
   * End the current sleep session
   */
  endSleepSession(
    userId: string,
    qualityRating?: number,
    moodAfterWake?: string,
    wakeNotes?: string
  ): Promise<SleepSession> {
    return new Promise((resolve, reject) => {
      const db = getDB();
      const now = Date.now();

      db.transaction(
        (tx) => {
          // Get active session
          tx.executeSql(
            'SELECT * FROM sleep_sessions WHERE user_id = ? AND wake_time IS NULL ORDER BY sleep_time DESC LIMIT 1',
            [userId],
            (_, result) => {
              if (result.rows.length === 0) {
                reject(new Error('No active sleep session found'));
                return;
              }

              const session = result.rows.item(0);
              const durationMinutes = Math.round((now - session.sleep_time) / (1000 * 60));
              const combinedNotes = session.notes 
                ? `${session.notes} | Wake: ${wakeNotes || ''}`
                : wakeNotes || null;

              // Update session with wake data
              tx.executeSql(
                `UPDATE sleep_sessions 
                 SET wake_time = ?, duration_minutes = ?, quality_rating = ?, 
                     mood_after_wake = ?, notes = ?, updated_at = ?
                 WHERE id = ?`,
                [now, durationMinutes, qualityRating || null, moodAfterWake || null, combinedNotes, now, session.id],
                () => {
                  const updatedSession: SleepSession = {
                    id: session.id,
                    userId: session.user_id,
                    sleepTime: session.sleep_time,
                    wakeTime: now,
                    durationMinutes,
                    qualityRating: qualityRating || undefined,
                    notes: combinedNotes || undefined,
                    moodBeforeSleep: session.mood_before_sleep || undefined,
                    moodAfterWake: moodAfterWake || undefined,
                    createdAt: session.created_at,
                    updatedAt: now
                  };
                  console.log('Sleep session ended:', updatedSession);
                  resolve(updatedSession);
                },
                (_, error) => {
                  reject(error);
                  return false;
                }
              );
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (error) => reject(error)
      );
    });
  }

  /**
   * Get the currently active sleep session
   */
  getActiveSleepSession(userId: string): Promise<SleepSession | null> {
    return new Promise((resolve, reject) => {
      const db = getDB();

      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM sleep_sessions WHERE user_id = ? AND wake_time IS NULL ORDER BY sleep_time DESC LIMIT 1',
            [userId],
            (_, result) => {
              if (result.rows.length === 0) {
                resolve(null);
                return;
              }

              const row = result.rows.item(0);
              resolve(this.mapRowToSleepSession(row));
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (error) => reject(error)
      );
    });
  }

  /**
   * Get recent sleep history
   */
  getSleepHistory(userId: string, limit: number = 7): Promise<SleepSession[]> {
    return new Promise((resolve, reject) => {
      const db = getDB();

      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM sleep_sessions 
             WHERE user_id = ? AND wake_time IS NOT NULL
             ORDER BY sleep_time DESC LIMIT ?`,
            [userId, limit],
            (_, result) => {
              const sessions: SleepSession[] = [];
              for (let i = 0; i < result.rows.length; i++) {
                sessions.push(this.mapRowToSleepSession(result.rows.item(i)));
              }
              resolve(sessions);
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (error) => reject(error)
      );
    });
  }

  /**
   * Get basic sleep statistics
   */
  getSleepStats(userId: string): Promise<SleepStats> {
    return new Promise((resolve, reject) => {
      const db = getDB();
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT 
               COUNT(*) as total_sessions,
               AVG(duration_minutes) as avg_duration,
               AVG(quality_rating) as avg_quality
             FROM sleep_sessions 
             WHERE user_id = ? AND wake_time IS NOT NULL AND sleep_time >= ?`,
            [userId, oneWeekAgo],
            (_, result) => {
              const stats = result.rows.item(0);
              
              // Get weekly average
              tx.executeSql(
                `SELECT AVG(duration_minutes) as weekly_avg
                 FROM sleep_sessions 
                 WHERE user_id = ? AND wake_time IS NOT NULL AND sleep_time >= ?`,
                [userId, oneWeekAgo],
                (_, weekResult) => {
                  const weekStats = weekResult.rows.item(0);
                  
                  resolve({
                    averageDuration: Math.round(stats.avg_duration || 0),
                    averageQuality: Math.round((stats.avg_quality || 0) * 10) / 10,
                    totalSessions: stats.total_sessions || 0,
                    currentStreak: 0, // Simplified for now
                    weeklyAverage: Math.round(weekStats.weekly_avg || 0)
                  });
                },
                (_, error) => {
                  reject(error);
                  return false;
                }
              );
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (error) => reject(error)
      );
    });
  }

  /**
   * Delete a sleep session
   */
  deleteSleepSession(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = getDB();

      db.transaction(
        (tx) => {
          tx.executeSql(
            'DELETE FROM sleep_sessions WHERE id = ?',
            [sessionId],
            () => {
              console.log('Sleep session deleted:', sessionId);
              resolve();
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (error) => reject(error)
      );
    });
  }

  /**
   * Set quality rating for a sleep session
   */
  setQuality(sessionId: string, rating: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = getDB();
      const now = Date.now();

      db.transaction(
        (tx) => {
          tx.executeSql(
            `UPDATE sleep_sessions SET quality_rating = ?, updated_at = ? WHERE id = ?`,
            [rating, now, sessionId],
            () => resolve(),
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (error) => reject(error)
      );
    });
  }

  // Helper methods
  private mapRowToSleepSession(row: any): SleepSession {
    return {
      id: row.id,
      userId: row.user_id,
      sleepTime: row.sleep_time,
      wakeTime: row.wake_time || undefined,
      durationMinutes: row.duration_minutes || undefined,
      qualityRating: row.quality_rating || undefined,
      notes: row.notes || undefined,
      moodBeforeSleep: row.mood_before_sleep || undefined,
      moodAfterWake: row.mood_after_wake || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Format duration for display
   */
  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  }

  /**
   * Get sleep quality description
   */
  static getQualityDescription(rating: number): string {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Not Rated';
    }
  }
}

export default new SleepService();
