import express from 'express';

export default async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { authorization } = request.headers;
    next();
};
