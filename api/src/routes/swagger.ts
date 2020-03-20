import { Router } from 'express';

import swaggerUI from 'swagger-ui-express';
import * as specs from '../../swagger';

const router = Router();

router.use('/', swaggerUI.serve, swaggerUI.setup(specs.default));

export default router;
