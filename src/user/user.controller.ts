import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { Response } from 'express'
import { Roles } from './decorators/roles.decorator';
import { Role } from './dto/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @Roles(Role.Admin, Role.SuperAdmin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  findAll(@Query() query: FilterUserDto, @Res() res: Response) {
    this.userService.findAll(query).then(
      (data) => {
        res.status(HttpStatus.OK).send(data)
      }
    ).catch(
      (err) => {
        res.status(HttpStatus.BAD_REQUEST).send(err)
      }
    );
  }

  @Get(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  findOne(@Param('id') id: string, @Res() res: Response) {
    this.userService.findOne(id).then(
      (data) => {
        res.status(HttpStatus.OK).send(data)
      }
    ).catch(
      (err) => {
        res.status(HttpStatus.BAD_REQUEST).send(err)
      }
    );
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    this.userService.update(id, updateUserDto).then(
      (data) => {
        if (data)
          res.status(HttpStatus.NO_CONTENT).send()
        else
          res.status(HttpStatus.NOT_FOUND).send()
      }
    ).catch(
      (err) => {
        res.status(HttpStatus.BAD_REQUEST).send(err)
      }
    )
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  remove(@Param('id') id: string, @Res() res: Response) {
    this.userService.remove(id).then(
      (data) => {
        if (data)
          res.status(HttpStatus.NO_CONTENT).send()
        else
          res.status(HttpStatus.NOT_FOUND).send()
      }
    ).catch(
      (err) => {
        res.status(HttpStatus.BAD_REQUEST).send(err)
      }
    )
  }
}
