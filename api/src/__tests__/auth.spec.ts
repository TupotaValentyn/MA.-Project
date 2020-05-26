import http from 'http';
import { Sequelize } from 'sequelize-typescript';

const supertest = require('supertest');
const initServer = require('../server').default;

let server: http.Server | null = null;
let a: any = null;

beforeAll((done) => {
    console.log('BA');

    initServer()
        .then((response: {nodeServer: http.Server, sequelizeInstance: Sequelize}) => {
            server = response.nodeServer;
            a = response.sequelizeInstance;
            done();
        }).catch(() => {
            process.exit(1);
        });
});

afterAll((done) => {
    console.log('CA');


    server.close(() => {
        console.log('close');
    });

    done();
});

describe('Auth.spec', () => {
    test('POST /register: triggers an error if email is not passed', async (done) => {
        const response = await supertest(server)
            .post('/auth/register')
            .send({ password: '12345678' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Некоректний email');
        done();
    });

    test('POST /register: triggers an error if email is incorrect', async (done) => {
        const response = await supertest(server)
            .post('/auth/register')
            .send({ password: '12345678', email: '123' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Некоректний email');
        done();
    });

    test('POST /register: triggers an error if password is not passed', async (done) => {
        const response = await supertest(server)
            .post('/auth/register')
            .send({ email: 'admin@test.com' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Неправильний пароль');
        done();
    });

    test('POST /register: triggers an error if password is incorrect', async (done) => {
        const response = await supertest(server)
            .post('/auth/register')
            .send({ password: '123456', email: 'admin@test.com' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Неправильний пароль');
        done();
    });

    // test('POST /register: triggers an error if user exists', async (done) => {
    //     const response = await supertest(server)
    //         .post('/auth/register')
    //         .send({ password: '12345678', email: 'admin@test.com' });
    //
    //     expect(response.status).toBe(400);
    //     expect(response.body.error).toBe('Користувач з таким email вже зареєстрований в системі');
    //
    //     a.close();
    //
    //     done();
    // });
});
