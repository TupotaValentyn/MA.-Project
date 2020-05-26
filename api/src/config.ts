import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: process.env.SERVER_PORT || 3000,

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'root',
    DB_NAME: process.env.DB_NAME || 'ma_project',

    MAIL_HOST: process.env.MAIL_HOST || 'localhost',
    MAIL_PORT: parseInt(process.env.MAIL_PORT, 10) || 465,
    MAIL_USER: process.env.MAIL_USER || 'root',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || 'root',

    SERVER_URL: process.env.SERVER_URL,
    FRONT_END_URL: process.env.FRONT_END_URL,

    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,

    AVAILABLE_LOCALES: ['ua', 'ru'],
    DEFAULT_LOCALE: 'ua',

    CHERKASY_CENTER: { lat: 49.4257529, lng: 32.0580019 },
    CHERKASY_BOUNDS_RADIUS: 6, // km
};
