const initServer = require('./src/server').default;

// Little fix for Jest, see https://stackoverflow.com/a/54175600
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

beforeAll((done) => {
    console.log('Global beforeAll');

    initServer()
        .then((instances) => {
            const { server, sequelize } = instances;

            global.serverInstance = server;
            global.sequelizeInstance = sequelize;

            done();
        }).catch(() => {
            process.exit(1);
        });
});

afterAll(async (done) => {
    console.log('Global afterAll');

    await global.sequelizeInstance.close();
    global.serverInstance.close(done);
});
