import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Films } from "./entity/Films/films.entity";
import { FilmsModule } from "./entity/Films/films.module";
import { Photo } from "./entity/Photo/photo.entity";
import { PhotoModule } from "./entity/Photo/photo.module";
import { Profile } from "./entity/Profile/profile.entity";
import { ProfileModule } from "./entity/Profile/profile.module";
import { TextBlock } from "./entity/textBlock/textBlock.entity";
import { TextBlockModule } from "./entity/textBlock/textBlock.module";
import { UsersModule } from "./entity/Users/user.module";
import { User } from './entity/Users/users.entity';



@Module({
    //свойство для иморта других модулей
    imports: [
        TypeOrmModule.forRoot({ //Импортируем базу данных
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'qwerty',
            database: 'authorization',
            entities: [User, Profile, TextBlock,Films, Photo],
            synchronize: true, 
        }),
        UsersModule,
        ProfileModule,
        TextBlockModule,
        PhotoModule,
        FilmsModule
    ]
})
export class AppModule{}