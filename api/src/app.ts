import server from './server';
import config from './config';

import connectToSequelize from './sequelize';

(async () => {
    try {
        await connectToSequelize();

        server.listen(config.PORT, () => {
            console.log(`\nServer successfully started at ${config.PORT}.`);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
