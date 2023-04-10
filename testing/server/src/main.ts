require('dotenv').config();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";


async function start() {
    try{
        const PORT = process.env.PORT || 3000;
        const app = await NestFactory.create(AppModule); // создание объект application
        await app.listen(PORT, () => console.log(`Сервер запущен на порте = ${PORT}`)); // запускаем application 
    }
    catch(e){
        console.log(e);
    }
}

start();
