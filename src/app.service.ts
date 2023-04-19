import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }
}
