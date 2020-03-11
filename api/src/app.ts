import express from 'express';

import rootRouter from './routes';

const app = express();

app.use('/', rootRouter);

export default app;
