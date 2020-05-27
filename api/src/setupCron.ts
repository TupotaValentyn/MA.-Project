import cron from 'node-cron';
import loadPlaces from './loadPlaces';

export default () => {
    cron.schedule('0 0 0 * * *', async () => {
        try {
            console.log('\n\nPlaces update: Start');
            await loadPlaces();
            console.log('Places update: Done\n\n');
        } catch (error) {
            console.log(error.message);
            console.log('Places update: Failed\n\n');
        }
    });
};
