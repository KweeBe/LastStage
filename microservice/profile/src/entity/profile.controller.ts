import { Controller } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { ProfileDto } from "src/dto/profile.dto";

@Controller()
export class ProfileController{
    constructor(private profileService: ProfileService ){}
    
    @MessagePattern('add.profile')
      postProfile(@Payload() data: ProfileDto, @Ctx() context: RmqContext) {       
        return this.profileService.addProfile(data);
      }

    @MessagePattern('get.profile')
      getProfile(@Payload() data: string, @Ctx() context: RmqContext): any {
        return this.profileService.viewProfile(data);
      }

    @MessagePattern('put.profile')
      putProfile(@Payload() data: ProfileDto, @Ctx() context: RmqContext): any {
        return this.profileService.updateProfile(data);
      }
    
    @MessagePattern('delete.profile')
      deleteProfile(@Payload() data: number, @Ctx() context: RmqContext): any {
        return this.profileService.deleteProfile(data);
      }

}