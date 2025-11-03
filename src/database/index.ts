import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES, CREATE_INDEXES, DATABASE_NAME } from './schema';

class Database {
  private db: SQLite.WebSQLDatabase | null = null;
  private initialized: boolean = false;

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Open database
      this.db = SQLite.openDatabase(DATABASE_NAME);
      
      console.log('📦 Database opened successfully');

      // Create tables
      await this.createTables();
      
      // Create indexes
      await this.createIndexes();
      
      this.initialized = true;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not opened');

    const tables = Object.entries(CREATE_TABLES);
    
    for (const [name, sql] of tables) {
      try {
        await this.executeSql(sql);
        console.log(`✓ Table created: ${name}`);
      } catch (error) {
        console.error(`✗ Failed to create table ${name}:`, error);
        throw error;
      }
    }
  }

  private async createIndexes(): Promise<void> {
    if (!this.db) throw new Error('Database not opened');

    const indexes = Object.entries(CREATE_INDEXES);
    
    for (const [name, sql] of indexes) {
      try {
        await this.executeSql(sql);
        console.log(`✓ Index created: ${name}`);
      } catch (error) {
        console.error(`✗ Failed to create index ${name}:`, error);
        // Don't throw - indexes are optional
      }
    }
  }

  private executeSql(sql: string, params: any[] = []): Promise<SQLite.SQLResultSet> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not opened'));
        return;
      }

      this.db.transaction(tx => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  getDatabase(): SQLite.WebSQLDatabase {
    if (!this.db || !this.initialized) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }

  async close(): Promise<void> {
    if (this.db) {
      // WebSQL databases don't need explicit closing
      this.db = null;
      this.initialized = false;
      console.log('📦 Database closed');
    }
  }

  async reset(): Promise<void> {
    console.warn('⚠️  Resetting database...');
    
    if (!this.db) throw new Error('Database not opened');

    // Drop all tables
    const dropStatements = [
      'DROP TABLE IF EXISTS portfolio_checks;',
      'DROP TABLE IF EXISTS notifications;',
      'DROP TABLE IF EXISTS ai_conversations;',
      'DROP TABLE IF EXISTS learning_progress;',
      'DROP TABLE IF EXISTS finance_transactions;',
      'DROP TABLE IF EXISTS finance_assets;',
      'DROP TABLE IF EXISTS habit_completions;',
      'DROP TABLE IF EXISTS habits;',
      'DROP TABLE IF EXISTS tasks;',
      'DROP TABLE IF EXISTS mood_entries;',
      'DROP TABLE IF EXISTS users;',
    ];

    for (const sql of dropStatements) {
      await this.executeSql(sql);
    }

    console.log('✓ All tables dropped');

    // Recreate tables
    await this.createTables();
    await this.createIndexes();

    console.log('✅ Database reset complete');
  }
}

// Singleton instance
export const database = new Database();

// Helper function to get database instance
export const getDB = () => database.getDatabase();

// Initialize database
export const initDatabase = () => database.init();

// Close database
export const closeDatabase = () => database.close();

// Reset database (development only)
export const resetDatabase = () => database.reset();
