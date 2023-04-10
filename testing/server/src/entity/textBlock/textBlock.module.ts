import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TextBlockController } from "./textBlock.controller";
import { TextBlock } from "./textBlock.entity";
import { TextBlockService } from "./textBlock.service";
import { PhotoService } from "../Photo/photo.service";
import { Photo } from "../Photo/photo.entity";
import { FilesService } from "../Photo/files.service";

@Module({
    imports: [TypeOrmModule.forFeature([TextBlock, Photo]), //указываем какие репозитории нам нужны
    JwtModule.register({ //указываем что мы будем использовать jwt токен
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions:{
            expiresIn: '30m'
        }
    })],
    controllers: [TextBlockController], //указываем контроллеры этого модуля
    providers: [TextBlockService, PhotoService, FilesService] //указываем какие сервисы мы будем использовать
})
export class TextBlockModule{

}