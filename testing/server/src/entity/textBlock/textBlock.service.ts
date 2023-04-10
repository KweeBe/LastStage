import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TextBlockDto } from "../../dto/textBlock.dto";
import { Repository } from "typeorm";
import { TextBlock } from "./textBlock.entity";
import { PhotoService } from "../Photo/photo.service";

@Injectable()
export class TextBlockService{

    constructor(@InjectRepository(TextBlock) //иджектим репозиторй TextBlock
            private textBlockRepositoriy: Repository<TextBlock>, //создаем обьект репозитория
            private photoService: PhotoService) {} //инжектим photoService


    //Создание текстового блока
    async createBlock(textBlcokDto: TextBlockDto, image: any){
        try{
            const name = textBlcokDto.name;
            const block = await this.textBlockRepositoriy.findOneBy({name});//поиск одной записи в таблице 
            if(block){
                throw new Error('Блок с такими названием уже существует');
            }

            let photoId;
            await this.photoService.create(image).then(result => photoId = result);


            const post = await this.textBlockRepositoriy.save({...textBlcokDto, idPhoto: photoId});//создание новой записи в таблице 

            await this.photoService.saveEntity("textblock",post.postId,[photoId]);

            return "Добавлено";
        }
        catch(e){
            return e.message;
        }
    }
    
    //Вывод всех блоков 
    async viewAllBlock(){
        try{   
            return await this.textBlockRepositoriy.find();//вывод всех записей
        }
        catch(e){
            return e.message;
        }
    }

    //Вывод всех блоков выбранной группы
    async viewBlockGroup(textBlcokDto: TextBlockDto){
        try{   
            const group = textBlcokDto.group;
            return await this.textBlockRepositoriy.findBy({group});//вывод всех записей подходящих условию
        }
        catch(e){
            return e.message;
        }
    }

    //обновление текстового блока
    async updateBlock(textBlcokDto: TextBlockDto, image: any){
        try{
            const postId = textBlcokDto.postId;
            if(!postId){
                return "Введите id";
            }
            const block = await this.textBlockRepositoriy.findOneBy({postId}) 
            if(!block){
                throw new Error('Нет блока с таким id');
            }
            const updateRow = {
                name: textBlcokDto.name,
                title: textBlcokDto.title,
                text: textBlcokDto.text,
                group: textBlcokDto.group,
                idPhoto: undefined
                
            }
            if(typeof image !== 'undefined'){
                let photoId;
                await this.photoService.create(image).then(result => photoId = result);
                await this.photoService.deleteEntity("textblock",block.postId);
                await this.photoService.saveEntity("textblock",block.postId,[photoId]);
                updateRow.idPhoto = photoId;
            }
            await this.textBlockRepositoriy.update(block.postId,updateRow);//изменение записи в таблице 
            return "Изменен"
        }
        catch(e){
            return e.message;
        }
    }

    //Удаление текстового блока
    async deleteBlock(textBlcokDto: TextBlockDto){
        try{
            const postId = textBlcokDto.postId;
            if(!postId){
                return "Введите id";
            }
            const block = await this.textBlockRepositoriy.findOneBy({postId})
            if(!block){
                throw new Error('Нет блока с таким id');
            }
            await this.textBlockRepositoriy.remove(block);//удаление записи в таблице 

            this.photoService.deleteEntity("textblock", postId);

            return "блок удален"
        }
        catch(e){
            return e.message;
        }
    }
}