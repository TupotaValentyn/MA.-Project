import express from 'express';
import { HttpErrorBase } from '@curveball/http-errors';

/* eslint-disable-next-line */
export default (error: HttpErrorBase, request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log(error.message);
    response.status(error.httpStatus || 500).json({ error: error.message || 'Server Error' });
};
