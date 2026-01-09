import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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
