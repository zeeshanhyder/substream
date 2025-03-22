import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import * as activities from '../../src/lib/activities';
import assert from 'assert';

describe.skip('greet activity', async () => {
  it('successfully greets the user', async () => {
    const env = new MockActivityEnvironment();
    const name = 'Temporal';
    const result = await env.run(activities.extractFileMetadata, name);
    assert.equal(result, 'Hello, Temporal!');
  });
});
