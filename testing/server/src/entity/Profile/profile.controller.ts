import { Body, Controller, Delete, Get, Post, Put, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { ProfileDto } from "../../dto/profile.dto";
import { RegistrationDto } from "../../dto/registration.dto";
import { UserDto } from "../../dto/user.dto";
import { AuthService } from "../Profile/auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { ProfileService } from "./profile.service";
import { RegistationService } from "./registration.servise";
import { UpdateDeleteGuard } from "./guards/updateDelete.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class ProfileController{

    constructor(private registartionService: RegistationService,//инджектим сервисы
        private authService: AuthService,
        private profileService: ProfileService ){}
    
    @UseInterceptors(FileInterceptor('image'))//Используме Interceptor
    @Post('registration')//эндпоинт для регистрации
    async create(@Body() regDto: RegistrationDto,//тело запроса записываем в переменную
        @UploadedFile() image){//выбранный файл записываем в переменную 
        return await this.registartionService.registration(regDto, image);
    }

    @Post('auth')//эндпоинт для авторизации
    async auth(@Body() userDto: UserDto){
        return this.authService.logining(userDto.login, userDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')//эндпоинт для вывода профайла
    async viewProfile(@Request() req){//записываем в переменную запрос
        const authHeader = req.headers.authorization;//из запроса берем часть авторизации
        const token = authHeader.split(' ')[1];
        return  this.profileService.viewProfile(token);
    }

    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(AuthGuard,UpdateDeleteGuard)
    @Put('profile')//эндпоинт для изменения профайла
    async editProfile(@Body() profileDto: ProfileDto,
        @UploadedFile() image){
        return this.profileService.updateProfile(profileDto, image);
    }

    @UseGuards(AuthGuard,UpdateDeleteGuard)
    @Delete('profile')//эндпоинт для удаления профайла
    async deleteProfile(@Body() profileDto: ProfileDto){
        return this.profileService.deleteProfile(profileDto);
    }

}