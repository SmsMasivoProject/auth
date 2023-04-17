import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AllUserDto } from './dto/all-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Query, QueryOptions } from 'mongoose';
import { randomUUID } from 'crypto';
import { FilterUserDto } from './dto/filter-user.dto';
import { OneUserDto } from './dto/one-user.dto';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto)
    createdUser.key = randomUUID()
    createdUser.secret = randomUUID()
    return createdUser.save()
  }

  async findAll(query: QueryOptions<FilterUserDto>): Promise<AllUserDto[]> {
    return (await this.userModel.find(query).exec()).map(this.allUsers)
  }

  async findOne(id: string): Promise<OneUserDto> {
    return this.oneUser((await this.userModel.findById(id).exec()))
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<OneUserDto> {
    return await this.userModel.findOneAndUpdate({_id: id}, updateUserDto)
  }

  async remove(id: string): Promise<OneUserDto> {
    return await this.userModel.findByIdAndDelete(id)
  }

  // adapters
  allUsers = (payload: any) => <AllUserDto>({
    _id: payload._id,
    firstname: payload.firstname,
    lastname: payload.lastname,
    phone: payload.phone,
    email: payload.email,
    company_name: payload.company_name,
    key: payload.key,
    roles: payload.roles
  })
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
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    }
  }
}
