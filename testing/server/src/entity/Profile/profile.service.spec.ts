require('dotenv').config();
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { ProfileService } from './profile.service';
import { ProfileDto } from 'src/dto/profile.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { check } from 'prettier';

describe('ProfileService', () => {
    let profile: ProfileDto;
    let app: INestApplication;
    let profileService: ProfileService;
    let authService: AuthService;
    let jwtService: JwtService;
    let token = '';
    let idUser;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(ProfileService)
            .useValue(profileService)
            .overrideProvider(AuthService)
            .useValue(authService)
            .overrideProvider(JwtService)
            .useValue(jwtService)
            .compile();
    
        app = moduleRef.createNestApplication();
        await app.init();


        await request(app.getHttpServer())
        .post('/auth')
        .send({
            login: "testiks",
            password:"testiks"
        })
        .set('Content-type', 'application/json')
        .expect(HttpStatus.CREATED)
        .expect(function(res){
            token = res.body.token;
        });

        profile = {
            profileId: undefined,
            firstName: "testiks",
            lastName:"testiks",
            email:"testiks",
            phone:"testiks",
            idPhoto:undefined,
            idUser: undefined}
    });

    it(`Вывод профиля не авторизованного пользователя`, () => {
        return request(app.getHttpServer())
        .get('/profile')
        .send()
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it(`Вывод профиля авторизованного пользователя`, async () => {
        const result = await request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

    });

    it(`изменение своего профиля`, async() => {

        const result = await request(app.getHttpServer())
            .get('/profile')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK);


        await request(app.getHttpServer())
            .put('/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({...profile, idUser: result.body.idUser, lastName: 'Test'})
            .expect(HttpStatus.OK);
    });

    it(`изменение чужого профиля без прав`, () => {
        return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({...profile, idUser: 2})
        .expect(HttpStatus.FORBIDDEN);
    });


    it(`Удаление чужого профиля`, () => {
        return request(app.getHttpServer())
        .delete('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({idUser: 2})
        .expect(HttpStatus.FORBIDDEN);
    });

    it(`Удаление своего профиля`, async () => {

        const result = await request(app.getHttpServer())
            .get('/profile')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK);

        return request(app.getHttpServer())
        .delete('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({...profile, idUser: result.body.idUser,})
        .expect(HttpStatus.OK);
    });

    afterAll(async () => {
        await app.close();
    });
});