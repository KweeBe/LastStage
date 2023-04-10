import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileDto } from "src/dto/profile.dto";
import { Repository } from "typeorm";
import { User } from "../Users/users.entity";
import { Profile } from "./profile.entity";
import { PhotoService } from "../Photo/photo.service";


@Injectable()//для использования в других местах
export class ProfileService{

    constructor(@InjectRepository(Profile) //инджектим репозиторй Profile
    private profileRespository: Repository<Profile>,//создаем обьект репозитория
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    private jwtService: JwtService, //инджектим сервисы
    private photoService: PhotoService){} 

    //Вывозд профайла
    async viewProfile(token: string){
        try{
            const user = this.jwtService.verify(token);//расшифровываем токен
            const idUser = user.idUser;
            const profile = await this.profileRespository.findOneBy({idUser});//поиск пользователя
            return {
                ...profile,
                idUser
            }
        }
        catch(e){
            return e.message;
        }
    }

    //Изменения данных профайла
    async updateProfile(profileDto: ProfileDto, image){
        try{
            const idUser = profileDto.idUser;
            if(!idUser){
                return "Введите id пользователя";
            }
            const profile = await this.profileRespository.findOneBy({idUser});
            if(!profile){
                throw new Error('Нет пользователя с таким id');
            }
            profile.firstName = profileDto.firstName,
            profile.lastName = profileDto.lastName,
            profile.phone = profileDto.phone,
            profile.email = profileDto.email 
            if(typeof image !== 'undefined'){
                let photoId;
                await this.photoService.create(image).then(result => photoId = result);
                await this.photoService.deleteEntity("profile",profile.profileId);
                await this.photoService.saveEntity("profile",profile.profileId,[photoId]);
                profile.idPhoto = photoId;
            }
            await this.profileRespository.save(profile);
            return "Изменен";
        }
        catch(e){
            return e.message;
        }     
    }

    //Удаления пользователя
    async deleteProfile(profileDto: ProfileDto){
        try{
            const idUser = profileDto.idUser;
            if(!idUser){
                return "Введите id пользователя";
            }
            console.log(idUser);
            const profile = await this.profileRespository.findOneBy({idUser})
            const user = await this.userRepository.findOneBy({idUser})
            if(!profile){
                throw new Error('Нет пользователя с таким id');
            }
            this.photoService.deleteEntity("profile", profile.profileId);
            await this.profileRespository.remove(profile); 
            await this.userRepository.remove(user); 
            return "Удален"
        }
        catch(e){
            console.log(e);
             return e.message;
        }
    }

}