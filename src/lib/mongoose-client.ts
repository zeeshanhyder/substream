import mongoose from 'mongoose';
import { URI as MONG_DB_HOST } from '../config/mongoose.config';

/**
 * MongoDB client wrapper for managing database connections
 * Handles connection lifecycle, retries, and event handling
 */
class MongoClient {
  private uri!: string;
  private dbResource!: typeof mongoose | null | undefined;
  private readonly maxRetries = 3;
  private readonly retryDelay = 5000;
  private clientOptions: mongoose.ConnectOptions = {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 30000,
    heartbeatFrequencyMS: 10000,
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  };

  /**
   * Creates a new MongoDB client instance
   * @param uri - MongoDB connection URI
   * @param clientOptions - Optional MongoDB connection options
   */
  constructor(uri: string, clientOptions?: mongoose.ConnectOptions) {
    this.uri = uri;
    if (clientOptions) {
      this.clientOptions = clientOptions;
    }
    this.createInstance();
  }

  /**
   * Sets up MongoDB connection event handlers
   * Handles disconnection, errors, and application termination
   * @private
   */
  private removeEventHandlers() {
    mongoose.connection.removeAllListeners('disconnected');
    mongoose.connection.removeAllListeners('error');
    process.removeAllListeners('SIGINT');
    console.log('INFO: MongoDB event handlers removed');
  }

  /**
   * Sets up MongoDB connection event handlers
   * Handles disconnection, errors, and application termination
   * @private
   */
  private setupEventHandlers() {
    mongoose.connection.removeAllListeners('disconnected');
    mongoose.connection.removeAllListeners('error');
    process.removeAllListeners('SIGINT');

    mongoose.connection.on('disconnected', () => {
      console.log('INFO: MongoDB disconnected. Attempting to reconnect...');
      this.createInstance();
    });

    mongoose.connection.on('error', (err) => {
      console.error('ERROR: MongoDB connection error:', err);
    });

    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('INFO: MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('ERROR: Failed to close MongoDB connection:', err);
        process.exit(1);
      }
    });
    console.log('INFO: MongoDB event handlers registered');
  }

  /**
   * Creates a MongoDB connection instance with retry logic
   * @private
   */
  private async createInstance() {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        mongoose.set('strictQuery', true);
        this.dbResource = await mongoose.connect(this.uri, this.clientOptions);
        console.log('INFO: MongoDB connection established');
        this.setupEventHandlers();
        break;
      } catch (err) {
        retries++;
        this.dbResource = null;
        this.removeEventHandlers();
        console.error(`ERROR: MongoDB connection attempt ${retries} failed:`, err);
        if (retries >= this.maxRetries) {
          throw new Error('Failed to connect to MongoDB after multiple attempts');
        }
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  /**
   * Connects to MongoDB using the configured URI and options
   * @returns Promise that resolves when connection is established
   */
  public async connect() {
    await this.createInstance();
  }

  /**
   * Gets the current MongoDB connection
   * @returns The mongoose connection instance or undefined if not connected
   */
  public getConnection() {
    if (!this.dbResource) {
      console.error('Database not connected. Exiting');
      return;
    }
    return this.dbResource;
  }

  /**
   * Gets the current MongoDB database instance
   * @returns The mongoose instance or undefined if not connected
   */
  public getDb() {
    if (!this.dbResource) {
      console.error('Database not connected. Exiting');
      return;
    }
    return this.dbResource;
  }

  /**
   * Disconnects from MongoDB
   * @returns Promise that resolves when disconnection is complete
   */
  public async disconnect() {
    if (this.dbResource) {
      await this.dbResource.disconnect();
      console.log('Database connected gracefully terminated.');
    }
  }
}

export const databaseInstance = new MongoClient(MONG_DB_HOST);
