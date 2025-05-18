import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public, ResponseMessage } from 'src/decorator/customize';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Create a new User")
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    const currentUser = {
      id: req.user._id,
      email: req.user.email
    };
    //const myEmail:String  = req.body.email
    let user = await this.usersService.create(createUserDto, currentUser);
    return {
      data: {
        _id: user._id,
        createdAt: user.createdAt
      }
    }
  }

  @Get()
  findAll(@Query("current") page: number, @Query("pagesize") limit: number,
    @Query() qs: string) {
    return this.usersService.findAll(+page, +limit, qs);
  }
  @Public()
  @ResponseMessage("Fetch user by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Update a User")
  async update(@Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto, @Request() req) {

    console.log('Updating user with _id:', updateUserDto._id);
    const currentUser = {
      id: req.user._id,
      email: req.user.email
    };
    return await this.usersService.update(updateUserDto, currentUser);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Delete a User")
  remove(@Param('id') id: string, @Request() req) {
    const currentUser = {
      id: req.user._id,
      email: req.user.email
    };
    return this.usersService.remove(id, currentUser);
  }
}
