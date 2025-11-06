import { Inject, Injectable, NestMiddleware } from "@nestjs/common";


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        console.log(`Request... ${req.method} ${req.originalUrl}`);


        console.log(`Response    ${res.statusCode}   {res.data}`)\
        
        next();
    }
    
}

