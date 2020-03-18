import { Router } from 'express';

const router = Router();

router.get('/', (request, response) => {
    response.json({
        success: true,
    });
});

export default router;
