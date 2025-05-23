import { TestWorkflowEnvironment } from '@temporalio/testing';
import { after, before, it } from 'mocha';
import { Worker } from '@temporalio/worker';
import processMedia from '../lib/propel/workflows/process-media.workflow';
import assert from 'assert';

describe('processMedia workflow with mocks', () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  it('successfully completes the Workflow with a mocked Activity', async () => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue,
      workflowsPath: require.resolve('../workflows'),
      activities: {
        greet: async () => 'Hello, Temporal!',
      },
    });

    const result = await worker.runUntil(
      client.workflow.execute(processMedia, {
        args: [{ userId: 'abc-123', mediaId: 'abc-122', filePath: 'fakepath' }],
        workflowId: 'test',
        taskQueue,
      }),
    );
    assert.equal(result, 'Hello, Temporal!');
  });
});
