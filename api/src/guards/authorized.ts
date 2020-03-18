import express from "express";

import {verify} from 'jsonwebtoken';
import {Forbidden} from "@curveball/http-errors";

import UserPublicData from "../types/UserPublicData";

export default async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { authorization } = request.headers;

    if (!authorization) {
        throw new Forbidden('Действие запрещено');
    }

    const [type, token] = authorization.split(' ');

    if (!(token && type === 'Bearer')) {
        throw new Forbidden('Действие запрещено');
    }

    try {
        request.user = await verify(token, process.env.JWT_SECRET) as UserPublicData;
        next();
    } catch (error) {
        console.error(error);
    }
};
