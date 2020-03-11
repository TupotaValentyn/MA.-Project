import { Router } from 'express';

const router = Router();

router.get('/', ((req, res) => {
    res.json({ name: "ma-project" });
}));

export default router;
