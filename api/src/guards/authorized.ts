import express from "express";

import { verify } from 'jsonwebtoken';
import { Forbidden, Unauthorized } from "@curveball/http-errors";

import UserPublicData from "../types/";

export default async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { authorization } = request.headers;

    if (!authorization) {
        throw new Forbidden('Действие запрещено');
    }

    const [type, token] = authorization.split(' ');

    if (!(token && type === 'Bearer')) {
        throw new Forbidden('Невалидный заголовок');
    }

    try {
        request.user = await verify(token, process.env.JWT_SECRET) as UserPublicData;
        next();
    } catch (error) {
        const { name } = error;

        if (name === 'TokenExpiredError') {
            throw new Unauthorized('Недействительный токен');
        }

        if (name === 'JsonWebTokenError') {
            throw new Forbidden('Невалидный токен');
        }

        throw error;
    }
};
