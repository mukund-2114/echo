import { getDB } from '@/database';

export interface VocabWord {
  id: string;
  word: string;
  definition: string;
  exampleSentence?: string;
  difficultyLevel?: number;
  learned?: number; // 0/1
  learnedDate?: number | null;
  reviewCount?: number;
  createdAt: number;
}

const SEED: Array<Pick<VocabWord, 'word' | 'definition' | 'exampleSentence'>> = [
  { word: 'abate', definition: 'to become less strong; to decrease in intensity', exampleSentence: 'The storm suddenly abated.' },
  { word: 'candor', definition: 'the quality of being open and honest', exampleSentence: 'She spoke with candor about her past.' },
  { word: 'diligent', definition: 'showing care and effort in work or duties', exampleSentence: 'He is diligent in his studies.' },
  { word: 'eclectic', definition: 'deriving ideas, style, or taste from a broad and diverse range of sources', exampleSentence: 'Her music taste is eclectic.' },
  { word: 'facilitate', definition: 'to make an action or process easier', exampleSentence: 'The new ramp will facilitate the entry of wheelchairs.' },
];

class VocabService {
  async seedIfEmpty(): Promise<void> {
    const db = getDB();
    await new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT COUNT(*) as c FROM vocabulary_words',
            [],
            (_, res) => {
              const count = res.rows.item(0).c as number;
              if (count > 0) return resolve();
              const now = Date.now();
              SEED.forEach((item) => {
                const id = `vocab_${item.word}_${now}`;
                tx.executeSql(
                  `INSERT INTO vocabulary_words (id, word, definition, example_sentence, difficulty_level, learned, review_count, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                  [id, item.word, item.definition, item.exampleSentence || null, 1, 0, 0, now]
                );
              });
              resolve();
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

  async getDailyWord(): Promise<VocabWord | null> {
    const db = getDB();
    // Use day key to rotate word
    const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    return await new Promise<VocabWord | null>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM vocabulary_words ORDER BY learned ASC, review_count ASC, created_at ASC`,
            [],
            (_, res) => {
              if (res.rows.length === 0) return resolve(null);
              const idx = dayIndex % res.rows.length;
              const r = res.rows.item(idx);
              resolve({
                id: r.id,
                word: r.word,
                definition: r.definition,
                exampleSentence: r.example_sentence || undefined,
                difficultyLevel: r.difficulty_level || 1,
                learned: r.learned || 0,
                learnedDate: r.learned_date || null,
                reviewCount: r.review_count || 0,
                createdAt: r.created_at,
              });
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

  async markLearned(id: string): Promise<void> {
    const db = getDB();
    const now = Date.now();
    await new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE vocabulary_words SET learned = 1, learned_date = ? WHERE id = ?',
            [now, id],
            () => resolve(),
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
}

export default new VocabService();
