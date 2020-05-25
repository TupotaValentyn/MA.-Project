import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    apis: ['./src/routes/*.ts', './src/models/*.ts', './src/types/*.ts'],
    basePath: '/',
    swaggerDefinition: {
        info: {
            description: 'Сервис по поиску мест и заведений для провождения досуга. API документация',
            swagger: '2.0',
            title: 'Сервис по поиску мест и заведений для провождения досуга',
            version: '1.0.0',
        },
    },
};

const specs = swaggerJsdoc(options);

export default specs;
