import supertest from 'supertest';

describe('auth::signInUsingGoogle', () => {
    it('triggers an error if token not passed', async (done) => {
        const response = await supertest(global.serverInstance)
            .post('/auth/google');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Не заданий token');
        done();
    });
});
