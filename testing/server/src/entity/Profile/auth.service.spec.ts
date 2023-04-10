require('dotenv').config();
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let app: INestApplication;
    let authService: AuthService


    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(AuthService)
            .useValue(authService)
            .compile();
    
        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`Успещная авторизация`, async () => {
        await request(app.getHttpServer())
        .post('/auth')
        .send({
            login: "testiks",
            password:"testiks"
        })
        .set('Content-type', 'application/json')
        .expect(HttpStatus.CREATED)
        .expect(function(res){
            console.log(res.body);
        });

    });

    it(`Неверный логин`, async () => {
        await request(app.getHttpServer())
        .post('/auth')
        .send({login: "300", password: "testiks"})
        .expect(HttpStatus.BAD_REQUEST);

    });

    it(`Неверный пароль`, async () => {
        await request(app.getHttpServer())
        .post('/auth')
        .send({login: "testiks", password: "10000000"})
        .expect(HttpStatus.BAD_REQUEST);
    });

    afterAll(async () => {
        await app.close();
    });
});