import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Profile } from "./profile.entity";
import { ProfileDto } from "src/dto/profile.dto";



@Injectable()
export class ProfileService{

    constructor(@InjectRepository(Profile) 
    private profileRepository: Repository<Profile>,
    private jwtService: JwtService,){}


    async addProfile(profile: ProfileDto){
        try{
            return await this.profileRepository.save(profile)
        }
        catch(e){
            return e.message;
        }
    }

    async viewProfile(token: string){
        try{
            const user = this.jwtService.verify(token);//расшифровываем токен
            const idUser = user.idUser;
            const profile = await this.profileRepository.findOneBy({idUser});//поиск пользователя
            return profile;
        }
        catch(e){
            return e.message;
        }
    }

    async updateProfile(profileDto: ProfileDto){
        try{
            const idUser = profileDto.idUser;
            if(!idUser){
                return "Введите id пользователя";
            }
            const profile = await this.profileRepository.findOneBy({idUser});
            if(!profile){
                throw new Error('Нет пользователя с таким id');
            }
            profile.firstName = profileDto.firstName,
            profile.lastName = profileDto.lastName,
            profile.phone = profileDto.phone,
            profile.email = profileDto.email 
            await this.profileRepository.save(profile);
            return "Изменен";
        }
        catch(e){
            return e.message;
        }     
    }

    async deleteProfile(idUser: number){
        try{
            if(!idUser){
                return "Введите id пользователя";
            }
            const profile = await this.profileRepository.findOneBy({idUser})
            if(!profile){
                throw new Error('Нет пользователя с таким id');
            }
            await this.profileRepository.remove(profile); 
            return "Удален"
        }
        catch(e){
             return e.message;
        }
    }

}