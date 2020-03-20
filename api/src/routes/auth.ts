import { Router } from 'express';

import UserPublicData from "../types/";

import { translate } from '../util';

import { User } from '../models';

const router = Router();

/**
 * @swagger
 * /cookies:
 *    post:
 *      tags:
 *          - Cookies
 *      summary: This should create a new cookie.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              flavor:
 *                type: string
 *      responses:
 *        200:
 *          description: Receive back flavor and flavor Id of recently added cookie.
 */
router.post('/local', async (request, response) => {
    const user = await User.create({
        id: null,
        email: 123
    });

    await user.save();

    response.json({ method: 'local' });
});

/**
 * @swagger
 * /ice-cream:
 *    get:
 *      tags:
 *          - Ice Cream
 *      summary: This should return all cookie flavors.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Receive back flavor and flavor Id of all cookie flavors.
 */
router.post('/register', (request, response) => {
    response.json({ method: 'register' });
});

/**
 * @swagger
 * /ice-cream2:
 *    get:
 *      tags:
 *          - Ice Cream
 *      summary: This should return all cookie flavors.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Receive back flavor and flavor Id of all cookie flavors.
 */
router.post('/google', (request, response) => {
    response.json({ method: 'google' });
});

/**
 * @swagger
 * /ice-cream3:
 *    get:
 *      tags:
 *          - Ice Cream
 *      summary: This should return all cookie flavors.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Receive back flavor and flavor Id of all cookie flavors.
 */
router.post('/facebook', (request, response) => {
    response.json({ method: 'facebook' });
});

export default router;
