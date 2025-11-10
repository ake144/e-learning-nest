
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findByEmail(username);
   
    console.log('userrr', user)

    const isPasswordMatch = await bcrypt.compare(pass, user?.password || '');

    if (!user || !isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate access token
    const payload = { sub: user.id, username: user.name, email: user.email };
    const access_token = await this.jwtService.signAsync(payload, { expiresIn: '15m' });

    // Generate refresh token
    const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    // Store refresh token in DB
    await this.prisma.refreshToken.create({
      data: {
        token: refresh_token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken);

      // Check if refresh token exists in DB and is not expired
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

 
      const newPayload = { sub: payload.sub, username: payload.username, email: payload.email };
      const access_token = await this.jwtService.signAsync(newPayload, { expiresIn: '15m' });

      return { access_token };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }
}
