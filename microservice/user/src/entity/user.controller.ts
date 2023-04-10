import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { UsersSerive } from './user.service';
import { UserDto } from './dto/user.dto';
import { RegistrationDto } from './dto/registration.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UsersSerive) {}
  
    @MessagePattern('add.user')
      postUser(@Payload() data: UserDto, @Ctx() context: RmqContext) {       
        return this.userService.addUser(data);
      }

    @MessagePattern('login.user')
      login(@Payload() data: UserDto, @Ctx() context: RmqContext) {
        return this.userService.logining(data.login, data.password);
      }
    
    @MessagePattern('update.role.user')
      updateRole(@Payload() data: UserDto, @Ctx() context: RmqContext) {
        return this.userService.updateRole(data);
      }

    @MessagePattern('delete.user')
      deleteUser(@Payload() data: number, @Ctx() context: RmqContext) {
        return this.userService.deleteUser(data);
      }
}