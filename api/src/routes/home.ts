import { BadRequest } from '@curveball/http-errors';

import { Router } from 'express';

const router = Router();

router.get('/', ((req, res) => {
    throw new BadRequest('Bad request');
}));

export default router;
