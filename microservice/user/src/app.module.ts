
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UsersModule } from './entity/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ 
      type: 'postgres',
      host: 'postgresUser',
      port: 5432,
      username: 'postgres',
      password: 'qwerty',
      database: 'user',
      entities: [User],
      synchronize: true, 
    }),
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
