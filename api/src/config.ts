import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

// Check for very important variables
if (!process.env.GOOGLE_PLACES_API_KEY) {
    logger.fatal('process.env.GOOGLE_PLACES_API_KEY not specified');
    process.exit(1);
}

const PORT = process.env.SERVER_PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

export default {
    PORT,
    NODE_ENV,

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'root',
    DB_NAME: NODE_ENV === 'test' ? 'ma_project_test' : (process.env.DB_NAME || 'ma_project'),

    MAIL_HOST: process.env.MAIL_HOST || 'localhost',
    MAIL_PORT: parseInt(process.env.MAIL_PORT, 10) || 465,
    MAIL_USER: process.env.MAIL_USER || 'root',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || 'root',

    SERVER_URL: process.env.SERVER_URL || `http://localhost:${PORT}`,
    FRONT_END_URL: process.env.FRONT_END_URL || 'http://3.250.170.88/',

    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    PASSWORD_HASH_SECRET: process.env.PASSWORD_HASH_SECRET || 'secret',

    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,

    AVAILABLE_LOCALES: ['ua', 'ru'],
    DEFAULT_LOCALE: 'ua',

    CHERKASY_CENTER: { lat: 49.4257529, lng: 32.0580019 },
    CHERKASY_BOUNDS_RADIUS: 6, // km
};
