import { Router } from 'express';

import UserPublicData from "../types/";

import { translate } from '../util';

import { User } from '../models';

const router = Router();

router.post('/local', async (request, response) => {
    const user = await User.create({
        name: 'Dmitry',
    });

    await user.save();

    response.json({ method: 'local' });
});

router.post('/register', (request, response) => {
    response.json({ method: 'register' });
});

router.post('/google', (request, response) => {
    response.json({ method: 'google' });
});

router.post('/facebook', (request, response) => {
    response.json({ method: 'facebook' });
});

export default router;
