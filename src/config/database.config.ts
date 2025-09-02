import mongoose from 'mongoose';

export default class DatabaseConfig {
  private uri: string;

  constructor() {
    this.uri = process.env.MONGO_URI || '';

    if (!this.uri) {
      throw new Error('MONGO_URI environment variable is required');
    }
  }

  async connect(): Promise<typeof mongoose> {
    try {
      const connection = await mongoose.connect(this.uri);
      console.log('Successfully connected to MongoDB successfully');
      return connection;
    } catch (error) {
      console.error('Error while connecting to MongoDB:', error);
      throw new Error(`Database connection failed: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch (error) {
      throw error;
    }
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}
