import { Router } from 'express';

import swaggerUI from 'swagger-ui-express';
import swaggerDoc from '../../swagger.json';

const router = Router();

router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(swaggerDoc));

export default router;
