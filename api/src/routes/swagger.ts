import { Router } from 'express';

import swaggerUiExpress from 'swagger-ui-express';
import * as specs from '../../swagger';

const router = Router();

router.use('/', swaggerUiExpress.serve, swaggerUiExpress.setup(specs.default));

export default router;
