import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { Photo } from './photo.entity';


@Injectable()
export class FilesService {

    //создание файлф
    async createFile(file): Promise<string>{
        try{
            const fileName = uuid.v4() + '.jpg';//генерируем уникальное название файлу
            
            const filePath = path.resolve(__dirname, '..','static');//соеденяем путь до папки с файлами
            if(!fs.existsSync(filePath)){//проверка на существование папки
                fs.mkdirSync(filePath,{recursive: true})//создание папки
            }
            fs.writeFileSync(path.join(filePath,fileName), file.buffer);//перенос файла в папку

            return fileName;
        }
        catch(e){
            throw new HttpException('Произошла ошибка при записе файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Удаление файлов из папки
    async deleteFile(file: Array<Photo>){
        try{
            for(let i = 0; i < file.length; i++){
                const filePath = path.resolve(__dirname, '..','static', file[i].photoName.toString());//соеденяем путь до папки с файлами
                fs.unlink(filePath, err =>{ //удаляем файл
                    if(err){}
                });
            }
        }
        catch(e){
            throw new HttpException('Произошла ошибка при удалении файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
