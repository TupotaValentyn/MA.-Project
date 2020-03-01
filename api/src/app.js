const app = require('express')();

const config = require('./config');

app.get('/', (request, response) => {
    response.json({ name: 'ma-project' });
});

app.listen(config.PORT, () => {
    console.log('Server successfully started');
});
