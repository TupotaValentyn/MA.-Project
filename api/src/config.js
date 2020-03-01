require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_HOST || 'root',
    DB_PASSWORD: process.env.DB_HOST || 'root',
    DB_NAME: process.env.DB_HOST || 'ma_project',
};
