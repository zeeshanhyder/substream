import { Router } from 'express';
import introspectionRouter from './introspection';

const router = Router();

// Register routes
router.use('/', introspectionRouter);

export default router;
