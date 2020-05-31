import { User } from '../models';

const supertest = require('supertest');

describe('auth::register', () => {
    it('triggers an error if email is not passed', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Некоректний email');
        done();
    });

    it('triggers an error if email is incorrect', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678', email: '123' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Некоректний email');
        done();
    });

    it('triggers an error if password is not passed', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ email: 'admin@test.com' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Неправильний пароль');
        done();
    });

    it('triggers an error if password is incorrect', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '123456', email: 'admin@test.com' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Неправильний пароль');
        done();
    });

    it('triggers an error if user exists', async (done) => {
        const email = `user${Math.random()}@test.com`;
        const password = '12345678';

        await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password, email });

        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password, email });

        await User.destroy({
            where: { email },
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Користувач з таким email вже зареєстрований в системі');

        done();
    });

    it('successfully creates new user', async (done) => {
        const email = `user${Math.random()}@test.com`;

        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678', email });

        const createdUser = await User.findOne({
            where: { email },
        });

        await User.destroy({
            where: { email },
        });

        expect(createdUser).not.toBe(null);
        expect(createdUser.email).toBe(email);
        expect(createdUser.locale).toBe('ua');
        expect(createdUser.isConfirmed).toBe(false);
        expect(createdUser.isAdmin).toBe(false);

        expect(response.status).toBe(200);
        expect(typeof response.body.userHash).toBe('string');

        done();
    });
});
