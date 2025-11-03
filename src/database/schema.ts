// Database Schema for Echo App

export const DATABASE_NAME = 'echo.db';
export const DATABASE_VERSION = 1;

// SQL statements for creating tables
export const CREATE_TABLES = {
  // Users table
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      created_at INTEGER NOT NULL,
      settings TEXT NOT NULL
    );
  `,

  // Mood entries table
  mood_entries: `
    CREATE TABLE IF NOT EXISTS mood_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      mood_type TEXT NOT NULL,
      intensity INTEGER NOT NULL,
      note TEXT,
      triggers TEXT,
      timestamp INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `,

  // Tasks table
  tasks: `
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      category TEXT NOT NULL,
      due_date INTEGER,
      start_time INTEGER,
      estimated_duration INTEGER,
      energy_required INTEGER,
      mood_tag TEXT,
      completed_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      subtasks TEXT,
      tags TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `,

  // Habits table
  habits: `
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      frequency TEXT NOT NULL,
      target_days TEXT,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      total_completions INTEGER DEFAULT 0,
      reminder_time TEXT,
      reminder_enabled INTEGER DEFAULT 1,
      category TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `,

  // Habit completions table
  habit_completions: `
    CREATE TABLE IF NOT EXISTS habit_completions (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      completed_at INTEGER NOT NULL,
      mood TEXT,
      note TEXT,
      FOREIGN KEY (habit_id) REFERENCES habits(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `,

  // Finance assets table
  finance_assets: `
    CREATE TABLE IF NOT EXISTS finance_assets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      symbol TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL,
      average_cost REAL NOT NULL,
      current_price REAL,
      last_updated INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `,

  // Finance transactions table
  finance_transactions: `
    CREATE TABLE IF NOT EXISTS finance_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      asset_id TEXT NOT NULL,
      type TEXT NOT NULL,
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      total_amount REAL NOT NULL,
      fees REAL,
      mood_at_transaction TEXT,
      notes TEXT,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (asset_id) REFERENCES finance_assets(id)
    );
  `,

  // Learning progress table
  learning_progress: `
    CREATE TABLE IF NOT EXISTS learning_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      challenge_id TEXT NOT NULL,
      challenge_type TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      time_spent INTEGER DEFAULT 0,
      hints_used INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      score INTEGER,
      completed_at INTEGER,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `,

  // AI conversations table
  ai_conversations: `
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      message TEXT NOT NULL,
      response TEXT NOT NULL,
      context TEXT,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `,

  // Notifications table
  notifications: `
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      data TEXT,
      scheduled_time INTEGER NOT NULL,
      sent_at INTEGER,
      read_at INTEGER,
      priority TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `,

  // Portfolio checks table (for emotional trading detection)
  portfolio_checks: `
    CREATE TABLE IF NOT EXISTS portfolio_checks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `,
};

// Indexes for better query performance
export const CREATE_INDEXES = {
  mood_entries_user_timestamp: `
    CREATE INDEX IF NOT EXISTS idx_mood_entries_user_timestamp 
    ON mood_entries(user_id, timestamp DESC);
  `,
  
  tasks_user_status: `
    CREATE INDEX IF NOT EXISTS idx_tasks_user_status 
    ON tasks(user_id, status);
  `,
  
  tasks_due_date: `
    CREATE INDEX IF NOT EXISTS idx_tasks_due_date 
    ON tasks(due_date);
  `,
  
  habits_user_active: `
    CREATE INDEX IF NOT EXISTS idx_habits_user_active 
    ON habits(user_id, is_active);
  `,
  
  habit_completions_habit: `
    CREATE INDEX IF NOT EXISTS idx_habit_completions_habit 
    ON habit_completions(habit_id, completed_at DESC);
  `,
  
  finance_transactions_user: `
    CREATE INDEX IF NOT EXISTS idx_finance_transactions_user 
    ON finance_transactions(user_id, timestamp DESC);
  `,
  
  ai_conversations_user: `
    CREATE INDEX IF NOT EXISTS idx_ai_conversations_user 
    ON ai_conversations(user_id, timestamp DESC);
  `,
  
  notifications_user_scheduled: `
    CREATE INDEX IF NOT EXISTS idx_notifications_user_scheduled 
    ON notifications(user_id, scheduled_time);
  `,
};

// Drop tables (for development/testing)
export const DROP_TABLES = {
  users: 'DROP TABLE IF EXISTS users;',
  mood_entries: 'DROP TABLE IF EXISTS mood_entries;',
  tasks: 'DROP TABLE IF EXISTS tasks;',
  habits: 'DROP TABLE IF EXISTS habits;',
  habit_completions: 'DROP TABLE IF EXISTS habit_completions;',
  finance_assets: 'DROP TABLE IF EXISTS finance_assets;',
  finance_transactions: 'DROP TABLE IF EXISTS finance_transactions;',
  learning_progress: 'DROP TABLE IF EXISTS learning_progress;',
  ai_conversations: 'DROP TABLE IF EXISTS ai_conversations;',
  notifications: 'DROP TABLE IF EXISTS notifications;',
  portfolio_checks: 'DROP TABLE IF EXISTS portfolio_checks;',
};
