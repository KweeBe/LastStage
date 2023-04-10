import { Body, Controller, Delete, Get, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { TextBlockDto } from "../../dto/textBlock.dto";
import { AuthGuard } from "../Profile/guards/auth.guard";
import { AdminGuard } from "./guard/admin.guard";
import { TextBlockService } from "./textBlock.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class TextBlockController{

    constructor(private textBlockService: TextBlockService){}//инджектим textBlockService

    @UseGuards(AuthGuard,AdminGuard) //Используме guards 
    @UseInterceptors(FileInterceptor('image')) //Используме Interceptor
    @Post('block') //эндпоинт для создания блока
    createBlock(@Body() textBlockDto: TextBlockDto,//тело запроса записываем в переменную
        @UploadedFile() image){//выбранный файл записываем в переменную 
        return this.textBlockService.createBlock(textBlockDto, image);
    }

    @UseGuards(AuthGuard,AdminGuard)
    @Get('block') //эндпоинт для вывода всех блоков
    viewAllBlock(){
        return this.textBlockService.viewAllBlock();
    }

    @UseGuards(AuthGuard,AdminGuard)
    @Get('block/group') //эндпоинт для вывода всех блоков 1 группы
    viewBlockGroup(@Body() textBlcokDto: TextBlockDto){
        return this.textBlockService.viewBlockGroup(textBlcokDto);
    }

    @UseGuards(AuthGuard,AdminGuard)
    @UseInterceptors(FileInterceptor('image'))
    @Put('block') //эндпоинт для изменения блока
    updateBlock(@Body() textBlockDto: TextBlockDto,
        @UploadedFile() image ){
        return this.textBlockService.updateBlock(textBlockDto,image);
    }

    @UseGuards(AuthGuard,AdminGuard)
    @Delete('block') //эндпоинт для удаления блока
    deleteBlock(@Body() textBlockDto: TextBlockDto ){
        return this.textBlockService.deleteBlock(textBlockDto);
    }

}