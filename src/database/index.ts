let initialized = false;

class StubDatabase {
  async init(): Promise<void> {
    initialized = true;
    console.log('✔ Database stub initialized (SQLite disabled for test run)');
  }
  async close(): Promise<void> {
    initialized = false;
  }
}

export const database = new StubDatabase();
export const initDatabase = () => database.init();
export const closeDatabase = () => database.close();
export const getDB = () => {
  throw new Error('Database not available in stub mode');
};
export const resetDatabase = async () => {};
