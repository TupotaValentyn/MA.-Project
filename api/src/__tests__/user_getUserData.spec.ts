import { User } from '../models';

const supertest = require('supertest');

describe('user::getUserByToken', () => {
    it('triggers an error if wrong token passed', async (done) => {
        const response = await supertest(global.serverInstance)
            .get('/user/my_token_code');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Недійсний токен');
        done();
    });

    it('returns user data if valid token passed', async (done) => {
        const email = `user${Math.random()}@test.com`;

        const registerResponse = await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678', email });

        await User.update({ isConfirmed: true }, {
            where: { email },
        });

        const { userHash } = registerResponse.body;

        const checkVerificationResponse = await supertest(global.serverInstance)
            .get(`/auth/check_verification/${userHash}`);

        const response = await supertest(global.serverInstance)
            .get(`/user/${checkVerificationResponse.body.tokenData.token}`);

        await User.destroy({
            where: { email },
        });

        expect(response.status).toBe(200);

        const { userData } = response.body;

        expect(typeof userData).toBe('object');
        expect(userData.email).toBe(email);
        expect(userData.isAdmin).toBe(false);
        expect(userData.isConfirmed).toBe(true);
        expect(userData.authType).toBe('local');
        expect(typeof userData.id).toBe('number');

        done();
    });
});
