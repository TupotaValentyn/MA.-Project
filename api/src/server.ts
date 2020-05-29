import http from 'http';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import 'express-async-errors';

import { Sequelize } from 'sequelize-typescript';
import rootRouter from './routes';
import errorsHandler from './routes/errorsHandler';
import { i18n } from './interceptors';
import connectToSequelize from './sequelize';
import config from './config';
import logger from './logger';
import setupCron from './setupCron';

export default async (): Promise<{ server: http.Server, sequelize: Sequelize }> => {
    const sequelizeInstance = await connectToSequelize();
    const app = express();

    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json());

    app.set('view engine', 'ejs');

    app.use('/', i18n, rootRouter);
    app.use(errorsHandler);

    const server = app.listen(config.PORT, () => {
        logger.info(`Server successfully started at ${config.PORT}.`);
    });

    if (config.NODE_ENV === 'production') {
        setupCron();
    }

    return { server, sequelize: sequelizeInstance };
};
