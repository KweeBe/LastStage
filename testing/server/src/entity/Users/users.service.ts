import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "../../dto/user.dto";
import { Repository } from "typeorm";
import { User } from "./users.entity";

//дает возможность ипользовать в других местах
@Injectable()
export class UsersSerive {
    

    constructor(@InjectRepository(User) //инджекстим репозиторий User
        private userRepository: Repository<User>){} //создаем обьект репозитория 

    //Обновление роли у пользователя
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
}