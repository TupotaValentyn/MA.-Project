const logger = require('./src/logger').default;
const initServer = require('./src/server').default;

// Little fix for Jest, see https://stackoverflow.com/a/54175600
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

beforeAll((done) => {
    logger.info('Global beforeAll');

    initServer()
        .then((instances) => {
            const { server, sequelize } = instances;

            global.serverInstance = server;
            global.sequelizeInstance = sequelize;

            done();
        }).catch((error) => {
            logger.fatal(error.message);
            process.exit(1);
        });
});

afterEach(() => {
    jest.resetAllMocks();
});

afterAll(async (done) => {
    logger.info('Global afterAll');

    await global.sequelizeInstance.close();
    global.serverInstance.close(done);
});
