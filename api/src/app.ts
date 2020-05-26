import server from './server';
import config from './config';

import setupCron from './setupCron';
import connectToSequelize from './sequelize';

(async () => {
    try {
        await connectToSequelize();

        server.listen(config.PORT, () => {
            console.log(`\nServer successfully started at ${config.PORT}.`);
        });

        setupCron();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
