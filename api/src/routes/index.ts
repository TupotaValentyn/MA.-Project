import { Router } from 'express';

import authRouter from './auth';
import mainRouter from './home';
import errorsHandler from '../errorsHandler';

const router = Router();

router.use('/', mainRouter);
router.use('/login', authRouter);
router.use(errorsHandler);

export default router;
