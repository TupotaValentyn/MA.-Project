import express from "express";

import { verify } from 'jsonwebtoken';
import { Forbidden, Unauthorized } from "@curveball/http-errors";

import { UserPublicData } from "index";

import { translate } from '../util';

export default async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { authorization } = request.headers;

    if (!authorization) {
        throw new Forbidden(translate(0, 'Действие запрещено'));
    }

    const [type, token] = authorization.split(' ');

    if (!(token && type === 'Bearer')) {
        throw new Forbidden(translate(0, 'Невалидный заголовок'));
    }

    try {
        request.user = await verify(token, process.env.JWT_SECRET) as UserPublicData;
        next();
    } catch (error) {
        const { name } = error;

        if (name === 'TokenExpiredError') {
            throw new Unauthorized(translate(0, 'Недействительный токен'));
        }

        if (name === 'JsonWebTokenError') {
            throw new Forbidden(translate(0, 'Недействительный токен'));
        }

        throw error;
    }
};
