import { Router } from 'express';

import authRouter from './auth';
import swaggerRouter from './swagger';

const router = Router();

router.use('/auth', authRouter);
router.use('/api-docs', swaggerRouter);

export default router;
