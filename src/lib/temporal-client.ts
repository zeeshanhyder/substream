import { Connection, Client } from '@temporalio/client';
import { processMediaWorkflow } from './propel/workflows';
import { nanoid } from 'nanoid';
import { temporalWorker } from './temporal-worker';
import * as activities from './activities';
import { Worker } from '@temporalio/worker';

/**
 * Client for interacting with Temporal workflows
 * Manages connections and provides methods to start and query workflows
 */
export class TemporalClient {
    /** Client instance for interacting with process media workflows */
    private processMediaClient!: Client;
    /** Default task queue name for media processing */
    private taskQueue = 'process-media';
    /** Temporal server host address */
    private host!: string;
    /** Temporal worker instance */
    private worker!: Worker | undefined;

    /**
     * Creates a new Temporal client instance
     * @param host - Temporal server host address
     */
    constructor(host: string) {
        this.host = host;
        this.init();
    }

    /**
     * Initializes Temporal connection and worker
     * @private
     */
    private async init() {
        console.log('INFO: Initializing Temporal');
        try {
            temporalWorker.start(this.host, this.taskQueue, activities);
            const connection = await Connection.connect({ address: this.host });
            const client = new Client({ connection });
            this.worker = temporalWorker.getWorker();
            this.processMediaClient = client;
            console.log('INFO: Temporal instance registered successfully!');
        } catch(err) {
            console.error('ERROR: Unable to register Temporal instance');
            throw err;
        }
    }

    /**
     * Gets the process media client instance
     * @returns The process media client for starting and managing workflows
     */
    public getProcessMediaClient() {
        return this.processMediaClient
    }

    /**
     * Gets the Temporal worker instance
     * @returns The Worker instance or undefined if not initialized
     */
    public getWorker() {
        return this.worker;
    }

    /**
     * Starts a media processing workflow
     * @param filePath - Path to media file needing processing
     * @param userId - Optional user identifier (default: generated nanoid)
     * @returns Promise resolving to workflow execution handle
     * @throws {Error} If workflow fails to start
     */
    public async startWorkFlow(filePath: string, userId: string = nanoid()) {
        try {
            const mediaId = nanoid();
            const handle = await this.processMediaClient.workflow.start(processMediaWorkflow, {
                taskQueue: this.taskQueue,
                args: [{ mediaId, filePath, userId }],
                workflowId: mediaId,
              });
              console.log(`Started workflow ${handle.workflowId}`);

              return handle;

        } catch(err) {
            console.error('ERROR: Unable to start workflow!');
            throw err;
        }
    }
}