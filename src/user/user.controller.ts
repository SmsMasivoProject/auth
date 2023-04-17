import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { Response } from 'express'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
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
