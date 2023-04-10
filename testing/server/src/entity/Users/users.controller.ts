import { Body, Controller, Put } from "@nestjs/common";
import { UserDto } from "../../dto/user.dto";
import { UsersSerive } from "./users.service";

//Контроллер 
@Controller('users')
export class UserController{

    
    constructor(private userService: UsersSerive) {} //инджектим userService

    //енд поинт для выдачи роли
    @Put('/role')
    async assignmentRole(@Body() userDto: UserDto){ // @Body записывает все из тела запроса в переменную 
        return await this.userService.updateRole(userDto); 
    }
}