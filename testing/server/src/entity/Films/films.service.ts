import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmsDto } from '../../dto/films.dto';
import { Repository } from 'typeorm';
import { Films } from './films.entity';
import { PhotoService } from '../Photo/photo.service';

@Injectable()
export class FilmsService {

    constructor(@InjectRepository(Films)//инджектим репозиторий
            private filmsRepository: Repository<Films>,// создаем обьект репозитория
            private photoService: PhotoService){}//инджектим сервисы

    //создание фильма
    async create(filmsDto: FilmsDto){
        try{
            const film =  await this.filmsRepository.save(filmsDto);//сохранение фильма
            this.photoService.saveEntity("films",film.filmsId, filmsDto.photos);
            return "Добавлен";
        }
        catch(e){
            return e.message;
        }
    }

    //вывод фильма
    async viewFilm(filmsDto: FilmsDto){
        try{
            const filmsId = filmsDto.filmsId;
            if(!filmsId){
                throw new Error('Введите id фильма')
            }
            return await this.filmsRepository.findOneBy({filmsId});//поиск фильма
        }
        catch(e){
            return e.message;
        }
    }

    //удаление фильма
    async deletFilm(filmsDto: FilmsDto){
        try{
            const filmsId = filmsDto.filmsId;
            if(!filmsId){
                throw new Error('Введите id фильма')
            }

            const film = await this.filmsRepository.findOneBy({filmsId});
            if(!film){
                throw new Error('Нет фильма с таким id')
            }

            await this.filmsRepository.remove(film);//удаление фильма
            this.photoService.deleteEntity("films", filmsId);
            return "Удален";
        }
        catch(e){
            return e.message;
        }
    }


    //обновление фильма
    async updateFilm(filmsDto: FilmsDto){
        try{
            const filmsId = filmsDto.filmsId;
            if(!filmsId){
                throw new Error('Введите id фильма')
            }

            const film = await this.filmsRepository.findOneBy({filmsId});
            if(!film){
                throw new Error('Нет фильма с таким id')
            }

            film.nameFilm = filmsDto.nameFilm;
            film.year_of_release = filmsDto.year_of_release;

            if(filmsDto.photos.length != 0){
                await this.photoService.deleteEntity("films",film.filmsId);
                await this.photoService.saveEntity("films",film.filmsId,filmsDto.photos);
            }

            await this.filmsRepository.save(film);//обновление фильма
            return "Изменен";
        }
        catch(e){
            return e.message;
        }
    }





}
