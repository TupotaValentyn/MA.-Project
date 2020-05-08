import express from 'express';
import config from '../config';

export default async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { locale } = request.query;
    request.locale = config.AVAILABLE_LOCALES.includes(locale) ? locale : config.DEFAULT_LOCALE;

    next();
};
