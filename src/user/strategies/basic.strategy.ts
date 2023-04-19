import {
  HttpException,
  Injectable,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }
  async validate(key: string, secret: string) {
    if (!key) throw new HttpException('Missed key value', 409);
    console.log(key, 'key');
    const data = await this.storageService.findOneUser(key);
    const user = data.rows[0];
    console.log(user, 'user');

    if (!user) throw new HttpException('Invalid key', 400);
    if (user.key === key && user.secret === secret) {
      return true;
    } else {
      throw new HttpException("key and secret don't match", 400);
    }
  }
}
