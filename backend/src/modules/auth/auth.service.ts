import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
      // 1. Seed Admin
      const email = 'admin@admin.com';
      const admin = await this.usersService.findByEmail(email);
      if (!admin) {
          console.log('Creating default admin user...');
          await this.usersService.create({
              email,
              nome: 'Administrador',
              password: '123456',
              avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
          });
      } else if (!admin.password) {
          console.log('Updating admin password...');
          admin.password = '123456';
          await this.usersService.create(admin);
      }

      // 2. Seed Products if empty
      // Seeding for other entities can be handled here or in their respective onModuleInit
  }

  async validateUserByPassword(email: string, pass: string) {
      const user = await this.usersService.findByEmail(email);
      if (user && user.password === pass) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...result } = user;
          return result;
      }
      return null;
  }

  async validateUser(googleUser: any) {
    let user = await this.usersService.findByEmail(googleUser.email);
    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        nome: `${googleUser.firstName} ${googleUser.lastName}`,
        googleId: googleUser.id,
        avatar: googleUser.picture,
      });
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
