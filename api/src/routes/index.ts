import { Router } from 'express';

import authRouter from './auth';
import swaggerRouter from './swagger';
import userRouter from './user';
import filtersRouter from './filters';
import placesRouter from './places';

const router = Router();

router.use('/auth', authRouter);
router.use('/api-docs', swaggerRouter);
router.use('/user', userRouter);
router.use('/filters', filtersRouter);
router.use('/places', placesRouter);

export default router;
