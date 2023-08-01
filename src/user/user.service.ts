import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AllUserDto } from './dto/all-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, QueryOptions } from 'mongoose';
import { randomUUID } from 'crypto';
import { FilterUserDto } from './dto/filter-user.dto';
import { OneUserDto } from './dto/one-user.dto';
import { CreateUserSchema } from './validators/create.validator';
import { UpdateUserSchema } from './validators/update.validator';
import { JwtService } from '@nestjs/jwt';
import { decryp, encryp } from 'src/utils/crypto.functions';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<OneUserDto> {
    createUserDto.password = await encryp(createUserDto.password);
    const result = CreateUserSchema.validate(createUserDto);
    if (result.error) throw new BadRequestException(result.error.details);
    const createdUser = new this.userModel(result.value);
    createdUser.key = randomUUID();
    createdUser.secret = randomUUID();
    let user = await createdUser.save();
    return this.oneUser(user);
  }

  async findAll(query: QueryOptions<FilterUserDto>): Promise<AllUserDto[]> {
    return (await this.userModel.find(query).exec()).map(this.allUsers);
  }

  async findOne(id: string): Promise<OneUserDto> {
    return this.oneUser(await this.userModel.findById(id).exec());
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<OneUserDto> {
    const result = UpdateUserSchema.validate(updateUserDto);
    if (result.error) throw new BadRequestException(result.error);
    return await this.userModel.findOneAndUpdate({ _id: id }, result.value);
  }

  async remove(id: string): Promise<OneUserDto> {
    return await this.userModel.findByIdAndDelete(id);
  }

  // adapters
  allUsers = (payload: any) =>
    <AllUserDto>{
      _id: payload._id,
      firstname: payload.firstname,
      lastname: payload.lastname,
      phone: payload.phone,
      email: payload.email,
      company_name: payload.company_name,
      key: payload.key,
      secret: payload.secret,
      roles: payload.roles,
      username: payload.username,
      refreshToken: payload.refreshToken,
    };
  oneUser = (payload: any): OneUserDto => {
    return {
      _id: payload._id,
      firstname: payload.firstname,
      lastname: payload.lastname,
      phone: payload.phone,
      email: payload.email,
      company_name: payload.company_name,
      key: payload.key,
      roles: payload.roles,
      secret: payload.secret,
      refreshToken: '',
      username: payload.username,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };
  };

  // Auth
  async validateUser(key: string, secret: string): Promise<any> {
    let users = await this.findAll({ key: key });
    let user = users[0];
    if (user && user.secret === secret) {
      const { secret, ...result } = user;
      return result;
    }
    return null;
  }

  public async signin(payload: any) {
    let tokens = await this.getTokens(payload);
    await this.updateRefreshToken(payload.key, tokens.refreshToken);
    return tokens;
  }

  async logout(token: string) {
    let key = this.jwtService.decode(token)['key'];
    let user = (await this.findAll({ key: key }))[0];
    return await this.update(user._id, { refreshToken: '' });
  }

  async refreshTokens(key: string, refreshToken: string) {
    const user = await this.getUserRefreshToken(key);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = user.refreshToken === refreshToken;

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens({ key });
    await this.updateRefreshToken(key, tokens.refreshToken);
    return tokens;
  }

  async getTokens(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_SECRET_KEY_EXPIRES,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_JWT_SECRET_KEY,
        expiresIn: process.env.REFRESH_JWT_SECRET_KEY_EXPIRES,
      }),
    ]);
    const exp: number = this.jwtService.decode(accessToken)['exp'];
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expireIn: new Date(exp * 1000),
    };
  }

  async getUserRefreshToken(key: string): Promise<any> {
    return (await this.findAll({ key: key }))[0];
  }

  async updateRefreshToken(key: string, refreshToken: string) {
    let user = await this.getUserRefreshToken(key);
    await this.update(String(user._id), { refreshToken: refreshToken });
  }
}
