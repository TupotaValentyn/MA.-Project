import { Router } from 'express';

import authRouter from './auth';
import swaggerRouter from './swagger';
import userRouter from './user';
import filtersRouter from './filters';

const router = Router();

router.use('/auth', authRouter);
router.use('/api-docs', swaggerRouter);
router.use('/user', userRouter);
router.use('/filters', filtersRouter);

export default router;
