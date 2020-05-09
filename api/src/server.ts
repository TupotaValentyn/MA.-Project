import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import 'express-async-errors';

import rootRouter from './routes';
import errorsHandler from './routes/errorsHandler';
import { i18n } from './interceptors';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use('/', i18n, rootRouter);
app.use(errorsHandler);

export default app;
