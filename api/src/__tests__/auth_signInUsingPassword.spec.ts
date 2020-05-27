import { User } from '../models';

const supertest = require('supertest');

describe('auth::signInUsingPassword', () => {
    it('triggers an error if user not found', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/local')
            .send({ password: '12345678', email: 'blablabla_some_email@blah.com' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Користувача з таким email не існує');
        done();
    });

    it('triggers an error if password is incorrect', async (done) => {
        const email = `user${Math.random()}@test.com`;

        await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678', email });

        const response = await supertest(global.serverInstance)
            .post('/auth/local')
            .send({ password: 'admin123', email });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Неправильний пароль');

        await User.destroy({
            where: { email },
        });

        done();
    });

    it('returns user\'s hash if user is not confirmed', async (done) => {
        const email = `user${Math.random()}@test.com`;
        const password = '12345678';

        await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password, email });

        const response = await supertest(global.serverInstance)
            .post('/auth/local')
            .send({ password, email });

        await User.destroy({
            where: { email },
        });

        expect(response.status).toBe(200);
        expect(typeof response.body.userHash).toBe('string');

        done();
    });

    it('returns token data if user is confirmed', async (done) => {
        const email = `user${Math.random()}@test.com`;
        const password = '12345678';

        await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password, email });

        await User.update({ isConfirmed: true }, {
            where: { email },
        });

        const response = await supertest(global.serverInstance)
            .post('/auth/local')
            .send({ password, email });

        await User.destroy({
            where: { email },
        });

        expect(response.status).toBe(200);
        expect(typeof response.body.tokenData).toBe('object');
        expect(typeof response.body.tokenData.expires).toBe('number');
        expect(typeof response.body.tokenData.token).toBe('string');

        done();
    });
});
