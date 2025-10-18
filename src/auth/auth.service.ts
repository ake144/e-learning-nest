
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(username);
   
    console.log('userrr', user)

    const isPasswordMatch = await bcrypt.compare(pass, user?.password || '');

    if (!user || !isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // You may want to return a JWT token here as in the commented code below
    const payload = { sub: user.id, username: user.name ,  email: user.email};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }


//   async signIn(
//     username: string,
//     pass: string,
//   ): Promise<{ access_token: string }> {
//     const user = await this.usersService.findOne(username);
//     if (user?.password !== pass) {
//       throw new UnauthorizedException();
//     }
//     const payload = { sub: user.userId, username: user.username };
//     return {
//       access_token: await this.jwtService.signAsync(payload),
//     };
//   }
}
