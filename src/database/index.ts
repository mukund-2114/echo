import * as SQLite from 'expo-sqlite';
import { CREATE_INDEXES, CREATE_TABLES, DATABASE_NAME } from './schema';

let db: SQLite.WebSQLDatabase | null = null;
let initialized = false;

function execStatements(statements: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('DB not open'));
    db.transaction(
      (tx) => {
        // Ensure FK on
        tx.executeSql('PRAGMA foreign_keys = ON;');
        statements.forEach((sql) => tx.executeSql(sql));
      },
      (err) => reject(err as any),
      () => resolve()
    );
  });
}

async function createSchema(): Promise<void> {
  const tables = [
    CREATE_TABLES.users,
    CREATE_TABLES.mood_entries,
    CREATE_TABLES.tasks,
    CREATE_TABLES.habits,
    CREATE_TABLES.habit_completions,
    CREATE_TABLES.finance_assets,
    CREATE_TABLES.finance_transactions,
    CREATE_TABLES.learning_progress,
    CREATE_TABLES.ai_conversations,
    CREATE_TABLES.notifications,
    CREATE_TABLES.portfolio_checks,
  ];
  const indexes = [
    CREATE_INDEXES.mood_entries_user_timestamp,
    CREATE_INDEXES.tasks_user_status,
    CREATE_INDEXES.tasks_due_date,
    CREATE_INDEXES.habits_user_active,
    CREATE_INDEXES.habit_completions_habit,
    CREATE_INDEXES.finance_transactions_user,
    CREATE_INDEXES.ai_conversations_user,
    CREATE_INDEXES.notifications_user_scheduled,
  ];
  await execStatements([...tables, ...indexes]);
}

export async function initDatabase(): Promise<void> {
  if (initialized && db) return;
  // Use sync open for broad compatibility
  db = SQLite.openDatabase(DATABASE_NAME);
  await createSchema();
  initialized = true;
  console.log('✅ Database initialized');
}

export async function closeDatabase(): Promise<void> {
  // close not required for expo-sqlite; reset references
  db = null;
  initialized = false;
}

export function getDB(): SQLite.WebSQLDatabase {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export const resetDatabase = async () => {
  // No-op for now
};
