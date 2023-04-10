import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Post, Put, Request, UseGuards} from '@nestjs/common';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import { UserDto } from './dto/user.dto';
import { ProfileDto } from './dto/profile.dto';
import { RegistrationDto } from './dto/registration.dto';
import { AuthGuard } from './guards/auth.guard';
import { UpdateDeleteGuard } from './guards/updateDelete.guard';

@Controller()
export class AppController {
  constructor(
    @Inject('User')
    private clietnUser: ClientProxy,
    @Inject('Profile')
    private clietnProfile: ClientProxy) {}


  @Post('/reg')
  async addUser(@Body() data: RegistrationDto) {

      if(!data.login || !data.password || !data.firstName 
        || !data.lastName || !data.email || !data.phone) {
          return 'Введите все данные!!';
      }

      return this.clietnUser.send('add.user',data).toPromise()
        .then(result => {
          if(!(+result)){
            throw new Error(result);
          }
          data.idUser = +result;
          this.clietnProfile.send('add.profile',data).toPromise();
          return "Регистрация прошла успешна";
        })
        .catch(e => {return e.message})
  }
  
  @Post('/auth')
  loging(@Body() user: UserDto){
      return this.clietnUser.send('login.user',user);
  }

  @Put('/role')
  updateRole(@Body() user: UserDto){
      return this.clietnUser.send('update.role.user',user);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  viewProfile(@Request() req){
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
      return this.clietnProfile.send('get.profile',token);
  }

  @UseGuards(AuthGuard,UpdateDeleteGuard)
  @Put('/profile')
  updateProfile(@Body() profile: ProfileDto){
      return this.clietnProfile.send('put.profile', profile);
  }

  @UseGuards(AuthGuard,UpdateDeleteGuard)
  @Delete('/profile')
  deleteProfileAndUser(@Body() profile: ProfileDto){
      return this.clietnUser.send('delete.user',profile.idUser).toPromise()
          .then(result => {
            if(typeof(result) === 'string'){
              throw new Error(result);
            }
            this.clietnProfile.send('delete.profile',profile.idUser).toPromise();
            return "удален";
        })
        .catch(e => {return e.message})
  }


}
