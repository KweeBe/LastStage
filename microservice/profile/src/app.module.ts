import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './entity/profile.module';
import { Profile } from './entity/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({ 
      type: 'postgres',
      host: 'postgresProfile',
      port: 5432,
      username: 'postgres',
      password: 'qwerty',
      database: 'profile',
      entities: [Profile],
      synchronize: true, 
    }),
    ProfileModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
