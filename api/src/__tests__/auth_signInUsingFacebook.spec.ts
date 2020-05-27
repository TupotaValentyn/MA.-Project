import supertest from 'supertest';

describe('auth::signInUsingFacebook', () => {
    it('triggers an error if accessToken not passed', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/facebook');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Не заданий accessToken');
        done();
    });

    it('triggers an error if userId not passed', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/facebook')
            .send({ accessToken: '1234' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Не заданий userId');
        done();
    });
});
