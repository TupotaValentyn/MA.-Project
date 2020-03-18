import { Router } from 'express';

import authRouter from './auth';
import mainRouter from './home';

import { authorized } from '../guards';

const router = Router();

router.use('/', authorized, mainRouter);
router.use('/login', authRouter);

export default router;
