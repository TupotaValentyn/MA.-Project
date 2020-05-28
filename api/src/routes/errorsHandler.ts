import express from 'express';
import { HttpErrorBase } from '@curveball/http-errors';

import logger from '../logger';

/* eslint-disable-next-line */
export default (error: HttpErrorBase, request: express.Request, response: express.Response, next: express.NextFunction) => {
    logger.error(error.message);
    response.status(error.httpStatus || 500).json({ error: error.message || 'Server Error' });
};
