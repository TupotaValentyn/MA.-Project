import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import 'express-async-errors';

import rootRouter from './routes';
import errorsHandler from './routes/errorsHandler';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use('/', (request, response, next) => { request.locale = 'ru'; next(); }, rootRouter);
app.use('/ru/', (request, response, next) => { request.locale = 'ru'; next(); }, rootRouter);
app.use('/ua/', (request, response, next) => { request.locale = 'ua'; next(); }, rootRouter);
app.use(errorsHandler);

export default app;
