import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from './films.entity';
import { PhotoModule } from '../Photo/photo.module';
import { FilesService } from '../Photo/files.service';
import { PhotoService } from '../Photo/photo.service';
import { Photo } from '../Photo/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Films, Photo]), PhotoModule], //использьуемы репозитории
  providers: [FilmsService, PhotoService, FilesService],//сервисы
  controllers: [FilmsController]//контролеры
})
export class FilmsModule {}
