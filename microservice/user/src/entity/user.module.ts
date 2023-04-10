import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersSerive } from "./user.service";
import { UserController } from "./user.controller";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [TypeOrmModule.forFeature([User]),
    JwtModule.register({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions:{
            expiresIn: '30m'
        }
    })],
    providers: [UsersSerive], 
    controllers: [UserController] 
})
export class UsersModule{}