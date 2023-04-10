import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "./profile.entity";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile]),
        JwtModule.register({
            secret: process.env.JWT_ACCESS_SECRET,
            signOptions:{
                expiresIn: '30m'
            }
        })],
    providers: [ProfileService],
    controllers: [ProfileController] 
})
export class ProfileModule{

}