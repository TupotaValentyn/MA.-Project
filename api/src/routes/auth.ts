import { Router } from 'express';

const router = Router();

router.post('/google', ((req, res) => {
    res.json({ method: 'google' });
}));

router.post('/facebook', ((req, res) => {
    res.json({ method: 'twitter' });
}));

router.post('/twitter', ((req, res) => {
    res.json({ method: 'twitter' });
}));

export default router;
