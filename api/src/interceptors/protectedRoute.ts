import express from 'express';

import { Forbidden } from '@curveball/http-errors';
import { translateText } from '../util';

export default async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { user } = request;

    if (!(user && user.isAdmin)) {
        throw new Forbidden(translateText('errors.actionIsForbidden', request.locale));
    }

    next();
};
