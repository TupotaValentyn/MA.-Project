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

app.use('/', rootRouter);
app.use(errorsHandler);

export default app;
