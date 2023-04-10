
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class UpdateDeleteGuard implements CanActivate {
    
    constructor(private jwtService: JwtService){}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{
        const req = context.switchToHttp().getRequest();
        try{
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const user = this.jwtService.verify(token);
            const userId = req.body.idUser;
            if(user.role !== 'Admin' && userId != user.idUser){
                throw new HttpException('Нет прав!!', HttpStatus.FORBIDDEN);  
            }

            return true;
        }
        catch(e){
            throw e;
        }
    }
}
