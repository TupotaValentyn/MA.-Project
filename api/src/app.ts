import server from './server';
import config from './config';

import connectToSequelize from './sequelize';

(async () => {
    try {
        await connectToSequelize();

        console.log('Connected to DB');

        server.listen(config.PORT, () => {
            console.log(`Server successfully started at ${config.PORT}.`);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
