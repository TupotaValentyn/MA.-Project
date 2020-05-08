import express from 'express';

export default async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { locale } = request.query;
    request.locale = ['ru', 'ua'].includes(locale) ? locale : 'ua';

    next();
};
