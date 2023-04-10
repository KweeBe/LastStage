import { Controller, Delete } from "@nestjs/common";
import { PhotoService } from "./photo.service";


@Controller('photo')
export class PhotoController{

    constructor(private photoService: PhotoService){}//инджектим сервисы

    @Delete()//энд поинт для удаления всех фото которые не используються
    delete(){
        return this.photoService.deleteFiles();
    }
}