import express from 'express';

const app = express();

app.get('/', (request, response) => {
    response.json({ name: 'ma-project' });
});

export default app;
