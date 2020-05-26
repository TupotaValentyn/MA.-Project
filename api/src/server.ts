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
import setupCron from './setupCron';

export default async (): Promise<{ nodeServer: http.Server, sequelizeInstance: Sequelize }> => {
    // const sequelizeInstance = await connectToSequelize();

    const app = express();

    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json());

    app.set('view engine', 'ejs');

    app.use('/', i18n, rootRouter);
    app.use(errorsHandler);

    const server = app.listen(config.PORT, () => {
        console.log(`\nServer successfully started at ${config.PORT}.`);
    });

    app.on('close', () => {
        console.log('close');

        // sequelizeInstance.close();
    });

    // setupCron();

    return { nodeServer: server, sequelizeInstance: null };
};
