import { Test } from '@nestjs/testing';
import { RegistationService } from './registration.servise';
import { RegistrationDto } from '../../dto/registration.dto';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('RegistrationeService', () => {
    let profile: RegistrationDto;
    let app: INestApplication;
    let registrationService:RegistationService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(RegistationService)
            .useValue(registrationService)
            .compile();
    
        app = moduleRef.createNestApplication();
        await app.init();

        profile = {login: "testiks",
        password:"testiks",
        firstName:"testiks",
        lastName:"testiks",
        email:"testiks",
        phone:"testiks",
        photo:"testiks"}
    });

    it(`Успещная регистрация`, async () => {
        const otvet = await request(app.getHttpServer())
        .post('/registration')
        .send(profile)
        .expect(HttpStatus.CREATED);
        console.log(otvet.body);
    });

    it(`Регистрация с логином который уже занят`, () => {
        return request(app.getHttpServer())
        .post('/registration')
        .send(profile)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`Регистрация с недостоющими полями`, () => {
        return request(app.getHttpServer())
        .post('/registration')
        .send({login: "testiks", password: "testiks"})
        .expect(HttpStatus.BAD_REQUEST);
    });

    afterAll(async () => {
        await app.close();
    });
});