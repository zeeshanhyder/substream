import { NativeConnection, Worker } from '@temporalio/worker';

/**
 * Manages Temporal worker connections and lifecycle
 * Provides methods to start, access, and close Temporal worker instances
 */
class TemporalWorker {

    private connection!: NativeConnection;
    private worker!: Worker;

    /**
     * Starts a Temporal worker with the specified configuration
     * @param address - The address of the Temporal server (e.g., 'localhost:7233')
     * @param taskQueue - The task queue name to poll for workflow and activity tasks
     * @param activities - Object containing activity implementations
     * @returns Promise that resolves when the worker is started
     */
    public async start(address: string, taskQueue: string, activities = {}){
        try {
            console.log('INFO: Initializing Temporal Worker...');
            this.connection = await NativeConnection.connect({
                address,
                // TLS and gRPC metadata configuration goes here.
              });
    
              this.worker = await Worker.create({
                connection: this.connection,
                namespace: 'default',
                taskQueue,
                // Workflows are registered using a path as they run in a separate JS context.
                workflowsPath: require.resolve('./propel/workflows'),
                activities,
                
              });
              console.log('INFO: Temporal Worker registered successfully!');
              await this.worker.run();
        } catch(err) {
            console.error('ERROR: Unable to register Temporal Worker');
            console.error(err);
        }

    }

    /**
     * Closes the Temporal worker connection
     * @returns Promise that resolves when the connection is closed
     */
    public async closeWorkerConnection() {
        await this.connection.close();
    }

    /**
     * Gets the current Temporal connection instance
     * @returns The NativeConnection instance
     */
    public getWorkerConnection() {
        return this.connection;
    }

    /**
     * Gets the current Temporal worker instance
     * @returns The Worker instance
     */
    public getWorker() {
        return this.worker;
    }
}

/**
 * Singleton instance of the TemporalWorker
 */
export const temporalWorker = new TemporalWorker();