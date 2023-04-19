import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: UserService) {
    super({
      usernameField: 'key',
      passwordField: 'secret',
    });
  }

  async validate(key: string, secret: string): Promise<any> {
    const user = await this.authService.validateUser(key, secret);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
