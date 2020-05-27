import initServer from './server';

initServer().catch((error) => {
    console.error(error);
    process.exit(1);
});
