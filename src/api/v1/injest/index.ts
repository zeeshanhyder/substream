import { Router } from 'express';
import scanDirectory from './scan/scan.post';
import { logMounts } from '../../utils';

const injest = Router();

injest.post('/scan', scanDirectory);

logMounts(injest, 'injest');

export default injest;
