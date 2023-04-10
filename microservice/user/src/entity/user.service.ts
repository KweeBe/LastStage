import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

const bcrypt = require('bcrypt');

@Injectable()
export class UsersSerive {

    constructor(@InjectRepository(User) 
    private userRepository: Repository<User>,
    private jwtService: JwtService){}

    async addUser(user: UserDto){
        try{
            const login = user.login;
            user.password = await bcrypt.hash(user.password, 3); //хешируем пароль
            const correctLogin = await this.userRepository.findOneBy({login}); //ищем пользователя с введеным логином
            if(correctLogin){
                throw new HttpException('Логин уже занят!!', HttpStatus.BAD_REQUEST);  
            }
            const createUser = await this.userRepository.save(user);
            return createUser.idUser;
        }
        catch(e){
            return e.message;
        }
    }
    
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
            return e.message;
        }

    }

    async generateToken(user: User){
        const payload = {idUser: user.idUser, role: user.role}; //поля которые зашифруем
        return { 
            token: this.jwtService.sign(payload)//генерируем токен
        }
    }

    async updateRole(userDto: UserDto){
        try{
            const idUser = userDto.idUser;
            if(!idUser){
                throw new Error('Введите Id');
            }
            const user = await this.userRepository.findOneBy({idUser}) //поиск одной записи в таблице 
            if(!user){
                throw new Error('Нет пользователя с таким id');
            }
            user.role = userDto.role;
            await this.userRepository.save(user); //Добавлении записи в таблицу 
            return "Роль выдана"
        }
        catch(e){
            return e.message;
        }

    }

    async deleteUser(idUser: number){
        try{
            if(!idUser){
                return "Введите id пользователя";
            }
            const user = await this.userRepository.findOneBy({idUser})
            if(!user){
                throw new Error('Нет пользователя с таким id');
            }
            return await this.userRepository.remove(user); 
        }
        catch(e){
            return e.message;
        }
    }
}