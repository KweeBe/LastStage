import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt/dist";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../Users/users.entity";

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) //инджектим репозиторий
    private userRepository: Repository<User>,//создаем обьект репозитория
    private jwtService: JwtService//инжектим серивис
    ) {}

    //авторазицаия
    async logining(login: string, password: string){
        try{
            const user =  await this.userRepository.findOneBy({login});//поиск пользователя
            if(!user){
                throw new HttpException(`Неверный логин или пароль`, HttpStatus.BAD_REQUEST);  
            }

            const isPassEquals =  await bcrypt.compare(password, user.password);//шифруем пароль и проверям 
            if(!isPassEquals){
                throw new HttpException(`Неверный логин или пароль`, HttpStatus.BAD_REQUEST);  
            }

            return this.generateToken(user);
        }
        catch(e){
            throw e;
        }

    }

    //генерация токена
    async generateToken(user: User){
        const payload = {idUser: user.idUser, role: user.role}; //поля которые зашифруем
        return { 
            token: this.jwtService.sign(payload)//генерируем токен
        }
    }
}