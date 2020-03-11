import { Router } from 'express';

import authRouter from './auth';
import mainRouter from './home';

const router = Router();

router.use('/', mainRouter);
router.use('/login', authRouter);

export default router;
