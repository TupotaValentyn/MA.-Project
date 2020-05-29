import { User } from '../models';

const supertest = require('supertest');

describe('user::changeLocale', () => {
    it('saves new locale', async (done) => {
        const email = `user${Math.random()}@test.com`;

        await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678', email });

        await User.update(
            { isConfirmed: true },
            {
                where: { email },
            }
        );

        const loginResponse = await supertest(global.serverInstance)
            .post('/auth/local')
            .send({ password: '12345678', email });

        const { tokenData } = loginResponse.body;

        const response = await supertest(global.serverInstance)
            .post('/user/change_locale')
            .set('Authorization', `Bearer ${tokenData.token}`)
            .send({ locale: 'ru' });

        await User.destroy({
            where: { email },
        });

        expect(response.status).toBe(200);
        expect(response.body.newLocale).toBe('ru');

        done();
    });

    it('validates locale correctly', async (done) => {
        const email = `user${Math.random()}@test.com`;

        await supertest(global.serverInstance)
            .post('/auth/register')
            .send({ password: '12345678', email });

        await User.update(
            { isConfirmed: true },
            {
                where: { email },
            }
        );

        const loginResponse = await supertest(global.serverInstance)
            .post('/auth/local')
            .send({ password: '12345678', email });

        const { tokenData } = loginResponse.body;

        const response = await supertest(global.serverInstance)
            .post('/user/change_locale')
            .set('Authorization', `Bearer ${tokenData.token}`)
            .send({ locale: 'de' });

        await User.destroy({
            where: { email },
        });

        expect(response.status).toBe(200);
        expect(response.body.newLocale).toBe('ua');

        done();
    });

    // it('returns user data if valid token passed', async (done) => {
    //     const email = `user${Math.random()}@test.com`;
    //
    //     const registerResponse = await supertest(global.serverInstance)
    //         .post('/auth/register')
    //         .send({ password: '12345678', email });
    //
    //     await User.update(
    //         { isConfirmed: true },
    //         {
    //             where: { email },
    //         }
    //     );
    //
    //     const { userHash } = registerResponse.body;
    //
    //     const checkVerificationResponse = await supertest(
    //         global.serverInstance
    //     ).get(`/auth/check_verification/${userHash}`);
    //
    //     const response = await supertest(global.serverInstance).get(
    //         `/user/${checkVerificationResponse.body.tokenData.token}`
    //     );
    //
    //     await User.destroy({
    //         where: { email },
    //     });
    //
    //     expect(response.status).toBe(200);
    //
    //     const { userData } = response.body;
    //
    //     expect(typeof userData).toBe('object');
    //     expect(userData.email).toBe(email);
    //     expect(userData.isAdmin).toBe(false);
    //     expect(userData.isConfirmed).toBe(true);
    //     expect(userData.authType).toBe('local');
    //     expect(typeof userData.id).toBe('number');
    //
    //     done();
    // });
});
