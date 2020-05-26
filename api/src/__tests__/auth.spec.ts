import { User } from '../models';

const supertest = require('supertest');

describe('Auth.spec', () => {
    it('POST /register: triggers an error if email is not passed', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Некоректний email');
        done();
    });

    it('POST /register: triggers an error if email is incorrect', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678', email: '123' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Некоректний email');
        done();
    });

    it('POST /register: triggers an error if password is not passed', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ email: 'admin@test.com' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Неправильний пароль');
        done();
    });

    it('POST /register: triggers an error if password is incorrect', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '123456', email: 'admin@test.com' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Неправильний пароль');
        done();
    });

    it('POST /register: triggers an error if user exists', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678', email: 'admin@test.com' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Користувач з таким email вже зареєстрований в системі');

        done();
    });

    it('POST /register: returns userHash on successful registration', async (done) => {
        const email = `user${Math.random()}@test.com`;

        const response = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678', email });

        expect(response.status).toBe(200);
        expect(typeof response.body.userHash).toBe('string');

        await User.destroy({
            where: { email },
        });

        done();
    });
});
