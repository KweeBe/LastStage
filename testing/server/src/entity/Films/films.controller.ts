import { Body, Controller, Delete, Get, Post, Put, UploadedFile } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilmsDto } from '../../dto/films.dto';
import { PhotoService } from '../Photo/photo.service';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {

    constructor(private filmsService: FilmsService, //инджектим сервисы
            private photoService: PhotoService){}

    @Post()//энд поинт на добавление фильма
    create(@Body() filmsDto: FilmsDto){ //тело запроса записываем в переменную
        return this.filmsService.create(filmsDto);
    }

    @Post('/loadPhoto')//энд поинт для загрузки скриншотов из фильма 
    @UseInterceptors(FileInterceptor('image'))//инджектим Interceptor
    load(@UploadedFile() image){ //загруженное фото записываем в переменную
        return this.photoService.create(image);

    }

    @Get()//энд поинт для вывода фильма
    view(@Body() filmsDto: FilmsDto){
        return this.filmsService.viewFilm(filmsDto);
    }

    @Put()//энд поинт для обновления фильма
    update(@Body() filmsDto: FilmsDto){
        return this.filmsService.updateFilm(filmsDto);
    }

    @Delete()//энд поинт для удаления фильма
    delete(@Body() filmsDto: FilmsDto){
        return this.filmsService.deletFilm(filmsDto);
    }



}
