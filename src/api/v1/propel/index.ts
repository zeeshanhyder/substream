import { Router } from 'express';
import processMedia from './process-media/process-media.post';
import getWorkflowStatus from './process-media/status.get';
import streamMedia from './stream/stream-media';
import { logMounts } from '../../utils';

const propel = Router();

propel.post('/process', processMedia);
propel.get('/process/status/:workflowId', getWorkflowStatus);
propel.get('/stream/:userId/:mediaId', streamMedia);

logMounts(propel, 'propel');

export default propel;
