import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.gard';
import { Public } from 'src/auth/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    sign(@Body()  signInDto: Record<string, any>) {
        // accept either { username, password } or { username, pass } from clients
        const username = signInDto.username ?? signInDto.email;
        const password = signInDto.password ?? signInDto.pass;

        return this.authService.signIn(username, password);
   }

   @Public()
   @Post('refresh')
   async refresh(@Body() body: { refresh_token: string }) {
     return this.authService.refreshToken(body.refresh_token);
   }

   @UseGuards(AuthGuard)
   @Post('logout')
   async logout(@Body() body: { refresh_token: string }) {
     await this.authService.logout(body.refresh_token);
     return { message: 'Logged out successfully' };
   }

   @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req){
        return req.user;
    }
}
