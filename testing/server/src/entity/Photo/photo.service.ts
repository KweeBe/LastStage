import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoDto } from '../../dto/photo.dto';
import { Brackets, Repository } from 'typeorm';
import { FilesService } from './files.service';
import { Photo } from './photo.entity';

@Injectable()
export class PhotoService {

    constructor(@InjectRepository(Photo)//инджектим репозиторий
            private photoRepository: Repository<Photo>,//создаем обьект репозитория
            private fileService: FilesService){}//инджектим сервисы

    //добовление файла в бд
    async create( image: any){
        try{
            const photoDto= new PhotoDto();
            const fileName = await this.fileService.createFile(image);
            const photo = await this.photoRepository.save({...photoDto, photoName: fileName})//сохраняем файл 
            return photo.photoId;
        }
        catch(e){
            return e.message;
        }

    }

    //обновляем обьект в бд с файлом при добавлении нового обьект в другой сущности
    async saveEntity(assenceTable: string, assenceId: number, photos: Array<number>){
        try{
            await this.photoRepository
                    .createQueryBuilder() //создаем query запрос на обновление
                    .update(Photo)
                    .set({assenceId: assenceId, assenceTable: assenceTable})
                    .where("photoId in (:...photos)", {photos})
                    .execute()
        }
        catch(e){
            throw new Error('Ошибка при изменении файла');
        }
    }

    //обновляем обьект в бд с файлом при удалении  обьект в другой сущности
    async deleteEntity(assenceTable: string, id:number){
        try{
            const otv = await this.photoRepository
                    .createQueryBuilder()
                    .update(Photo)
                    .set({assenceId: null, assenceTable: null})
                    .where("assenceTable like :assenceTable", {assenceTable})
                    .andWhere("assenceId = :id", {id})
                    .execute()
        }
        catch(e){
            throw new Error('Ошибка при изменении файла');
        }
    }
    
    //Удаления всех файлов которые не используються
    async deleteFiles(){
        try{

            const files = await this.photoRepository
                    .createQueryBuilder() //создаем query запрос на получение всех файлов которые не используються
                    .select("photo.photoName")
                    .from(Photo, "photo")
                    .where('(NOW() - photo.createdAt) > :hourse', {hourse: '1 hours'} )
                    .andWhere(
                        new Brackets((qb) => {
                            qb.where("photo.assenceTable is NULL")
                            .orWhere("photo.assenceId is NULL")
                            })
                    )
                    .getMany();
            
            const count = await this.photoRepository
                    .createQueryBuilder()//создаем запрос на удаления всех файлов которые не используються
                    .delete()
                    .from(Photo)
                    .where('(NOW() - createdAt) > :hourse', {hourse: '1 hours'} )
                    .andWhere(
                        new Brackets((qb) => {
                            qb.where("assenceTable is NULL")
                            .orWhere("assenceId is NULL")
                            })
                    )
                    .execute()
            this.fileService.deleteFile(files);
            return `Количество удаленных строк: ${count.affected}`;
        }
        catch(e){
            return e.message;
        }
    }

}
