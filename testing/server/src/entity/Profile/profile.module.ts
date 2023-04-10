import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../Users/users.entity";
import { UsersSerive } from "../Users/users.service";
import { AuthService } from "./auth.service";
import { ProfileController } from "./profile.controller";
import { Profile } from "./profile.entity";
import { ProfileService } from "./profile.service";
import { RegistationService } from "./registration.servise";
import { PhotoService } from "../Photo/photo.service";
import { FilesService } from "../Photo/files.service";
import { PhotoModule } from "../Photo/photo.module";
import { Photo } from "../Photo/photo.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile, User, Photo]),//указываем какие репозитории нам нужны
        JwtModule.register({//указываем что мы будем использовать jwt токен
            secret: process.env.JWT_ACCESS_SECRET,
            signOptions:{
                expiresIn: '30m'
            }
        }),
        PhotoModule],
    providers: [ProfileService, UsersSerive, //указываем какие сервисы мы будем использовать
        AuthService, RegistationService, 
        PhotoService, FilesService],
    controllers: [ProfileController] //указываем контроллеры этого модуля
})
export class ProfileModule{

}