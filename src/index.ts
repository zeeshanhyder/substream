import express from 'express';
import { getLocalIPAddress } from './util/get-ip-address';
import { TemporalClient } from './lib/temporal-client';
import attachTemporalClient from './middleware/temporal';
import { exit } from 'process';

import propelRoutes from './api/v1/propel';
import personaRoutes from './api/v1/persona';
import injestRoutes from './api/v1/injest';

const port = process.env.SUBSTREAM_API_SERVER_PORT || 7455;
let temporalClient: TemporalClient;

try {
  const temporalHost = process.env.TEMPORAL_HOST || 'localhost';
  temporalClient = new TemporalClient(temporalHost);
} catch (error) {
  console.error('ERROR: Failed to start Temporal Worker', error);
  exit(1);
}

const app = express();
app.use(express.json());
app.use(attachTemporalClient(temporalClient));

app.use('/v1/propel/', propelRoutes);
app.use('/v1/persona/', personaRoutes);
app.use('/v1/injest/', injestRoutes);

console.info('[substream] All routes mounted!\n');

app.listen(port, () => {
  console.log('INFO: Temporal API Server started successfully');
  console.log(`INFO: Server running at:${getLocalIPAddress()}:${port}`);
});
