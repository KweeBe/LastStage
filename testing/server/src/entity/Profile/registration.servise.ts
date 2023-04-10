import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileDto } from "../../dto/profile.dto";
import { RegistrationDto } from "../../dto/registration.dto";
import { UserDto } from "../../dto/user.dto";
import { Repository } from "typeorm";
import { User } from "../Users/users.entity";
import { Profile } from "./profile.entity";
import { PhotoService } from "../Photo/photo.service";

const bcrypt = require('bcrypt');

@Injectable()//для использования в других местах
export class RegistationService {

    constructor(@InjectRepository(User) //инджектим репозиторй 
    private userRepository: Repository<User>, //создаем обьект репозитория
    @InjectRepository(Profile) 
    private profileRepository: Repository<Profile>,
    private photoService: PhotoService) {} //инджектим сервисы

    //регистрация нового пользователя
    async registration(regDto: RegistrationDto, image: any) {
        if(!regDto.login || !regDto.password || !regDto.firstName 
            || !regDto.lastName || !regDto.email || !regDto.phone){
                throw new HttpException('Введите все данные!!', HttpStatus.BAD_REQUEST);  
        }
        const login = regDto.login;
        regDto.password = await bcrypt.hash(regDto.password, 3); //хешируем пароль
        const correctLogin = await this.userRepository.findOneBy({login}); //ищем пользователя с введеным логином
        if(correctLogin){
            throw new HttpException('Логин уже занят!!', HttpStatus.BAD_REQUEST);  
        }

        let user = new UserDto; 
        user.login = regDto.login;
        user.password = regDto.password;
        const createUser = await this.userRepository.save(user); //сохраняем пользоватея
        
        let profile = new ProfileDto;
        profile.firstName = regDto.firstName;
        profile.lastName = regDto.lastName;
        profile.email = regDto.email;
        profile.phone = regDto.phone;
        profile.idUser = createUser.idUser;

        if(typeof image !== 'undefined'){
            let photoId;
            await this.photoService.create(image).then(result => photoId = result);
            profile.idPhoto = photoId;
            await this.photoService.saveEntity("profile",profile.profileId,[photoId]);
        }

        await this.profileRepository.save(profile);//сохраняем профайл

        return "Регистрация прошла успешна"
 
    }
}