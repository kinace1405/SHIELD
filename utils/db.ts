// utils/db.ts
const Database = require("@replit/database");

class DatabaseService {
  private static instance: DatabaseService;
  private db: any;
  private prefix: string;

  private constructor() {
    this.db = new Database();
    this.prefix = 'senator:';
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async getMessages(username: string): Promise<any[]> {
    try {
      const key = `${this.prefix}messages:${username}`;
      const messages = await this.db.get(key);
      return messages || [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async addMessage(username: string, message: any): Promise<void> {
    try {
      const key = `${this.prefix}messages:${username}`;
      const messages = await this.getMessages(username);
      messages.push(message);
      await this.db.set(key, messages);
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async getUser(username: string): Promise<any> {
    try {
      const key = `${this.prefix}user:${username}`;
      return await this.db.get(key);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
}

// Create instance
const dbService = DatabaseService.getInstance();

// Export functions
export const getMessages = (username: string) => dbService.getMessages(username);
export const addMessage = (username: string, message: any) => dbService.addMessage(username, message);
export const getUser = (username: string) => dbService.getUser(username);

// Export the service instance as default
export default dbService;