import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersSerive } from "./users.service";
import { UserController } from "./users.controller";
import { User } from "./users.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])], //указываем какие репозитори нам нужны
    providers: [UsersSerive], //указываем какие сервисы нам нужны
    controllers: [UserController] //указываем какие контроллеры этого модулю
})
export class UsersModule{}