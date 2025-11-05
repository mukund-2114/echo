import { getDB } from '@/database';

export interface CodingPrompt {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  solutionNotes?: string | null;
  completed?: number; // 0/1
  completedDate?: number | null;
  timeSpentMinutes?: number | null;
  createdAt: number;
}

const SEED: Array<Pick<CodingPrompt, 'title' | 'description' | 'difficulty'>> = [
  { title: 'Two Sum', description: 'Given an array of integers and a target, return indices of the two numbers that add up to the target.', difficulty: 'easy' },
  { title: 'Valid Parentheses', description: 'Given a string s containing just the characters (), {}, [], determine if the input is valid.', difficulty: 'easy' },
  { title: 'Merge Intervals', description: 'Given a collection of intervals, merge all overlapping intervals.', difficulty: 'medium' },
  { title: 'LRU Cache', description: 'Design a data structure that follows the constraints of a Least Recently Used cache.', difficulty: 'hard' },
  { title: 'Binary Search', description: 'Implement binary search on a sorted array.', difficulty: 'easy' },
];

class CodingPromptService {
  async seedIfEmpty(): Promise<void> {
    const db = getDB();
    await new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql('SELECT COUNT(*) as c FROM coding_prompts', [], (_, res) => {
            const c = res.rows.item(0).c as number;
            if (c > 0) return resolve();
            const now = Date.now();
            SEED.forEach((p, i) => {
              const id = `code_${i}_${now}`;
              tx.executeSql(
                `INSERT INTO coding_prompts (id, title, description, difficulty, category, completed, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [id, p.title, p.description, p.difficulty, 'general', 0, now]
              );
            });
            resolve();
          }, (_, err) => { reject(err); return false; });
        },
        (e) => reject(e)
      );
    });
  }

  async getDailyPrompt(): Promise<CodingPrompt | null> {
    const db = getDB();
    const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    return await new Promise<CodingPrompt | null>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM coding_prompts ORDER BY completed ASC, difficulty ASC, created_at ASC`,
            [],
            (_, res) => {
              if (res.rows.length === 0) return resolve(null);
              const idx = dayIndex % res.rows.length;
              const r = res.rows.item(idx);
              resolve({
                id: r.id,
                title: r.title,
                description: r.description,
                difficulty: r.difficulty,
                category: r.category || undefined,
                solutionNotes: r.solution_notes || null,
                completed: r.completed || 0,
                completedDate: r.completed_date || null,
                timeSpentMinutes: r.time_spent_minutes || null,
                createdAt: r.created_at,
              });
            },
            (_, err) => { reject(err); return false; }
          );
        },
        (e) => reject(e)
      );
    });
  }

  async markCompleted(id: string, minutes?: number): Promise<void> {
    const db = getDB();
    const now = Date.now();
    await new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `UPDATE coding_prompts SET completed = 1, completed_date = ?, time_spent_minutes = COALESCE(?, time_spent_minutes) WHERE id = ?`,
            [now, minutes ?? null, id],
            () => resolve(),
            (_, err) => { reject(err); return false; }
          );
        },
        (e) => reject(e)
      );
    });
  }
}

export default new CodingPromptService();
