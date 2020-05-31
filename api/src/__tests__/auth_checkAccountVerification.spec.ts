import { User } from '../models';

const supertest = require('supertest');

describe('auth::checkAccountVerification', () => {
    it('triggers an error if user not found', async (done) => {
        const response = await supertest(global.serverInstance)
            .get('/auth/check_verification/0asdqwe');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Неправильний хеш');

        done();
    });

    it('returns false if user is not confirmed', async (done) => {
        const email = `user${Math.random()}@test.com`;
        const password = '12345678';

        const res = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password, email });

        const { userHash } = res.body;

        const response = await supertest(global.serverInstance)
            .get(`/auth/check_verification/${userHash}`);

        await User.destroy({
            where: { email },
        });

        expect(response.status).toBe(200);
        expect(response.body.isConfirmed).toBe(false);

        done();
    });

    it('returns tokenData if user is confirmed', async (done) => {
        const email = `user${Math.random()}@test.com`;
        const password = '12345678';

        const res = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password, email });

        await User.update({ isConfirmed: true }, {
            where: { email },
        });

        const { userHash } = res.body;

        const response = await supertest(global.serverInstance)
            .get(`/auth/check_verification/${userHash}`);

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
