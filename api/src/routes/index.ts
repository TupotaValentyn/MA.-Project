import { Router } from 'express';

import authRouter from './auth';
import swaggerRouter from './swagger';
import userRouter from './user';

const router = Router();

router.use('/auth', authRouter);
router.use('/api-docs', swaggerRouter);
router.use('/user', userRouter);

export default router;
