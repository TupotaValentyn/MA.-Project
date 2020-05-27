import { User } from '../models';

const supertest = require('supertest');

describe('auth::resendConfirmationEmail', () => {
    it('triggers an error if user not found', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/resend_confirmation/0asdqwe');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Неправильний хеш');

        done();
    });

    it('returns new userHash', async (done) => {
        const email = `user${Math.random()}@test.com`;
        const password = '12345678';

        const res = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password, email });

        const { userHash } = res.body;

        const response = await supertest(global.serverInstance)
            .post(`/auth/resend_confirmation/${userHash}`);

        await User.destroy({
            where: { email },
        });

        expect(response.status).toBe(200);
        expect(typeof response.body.userHash).toBe('string');
        expect(response.body.userHash !== userHash).toBe(true);

        done();
    });
});
