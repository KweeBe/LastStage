import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate { //guard для проверка на роль Admin
    constructor(private jwtService: JwtService){}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{
        const req = context.switchToHttp().getRequest();
        try{
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const user = this.jwtService.verify(token);
            if(user.role !== 'Admin'){
                throw new HttpException('Нет прав!!', HttpStatus.FORBIDDEN);  
            }

            return true;
        }
        catch(e){
            throw new HttpException('Нет прав!!', HttpStatus.FORBIDDEN);  
        }
    }
}