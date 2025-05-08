import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private UserModel: Model<User>) { }
  // private UserModel: Model<User>
  // constructor(@InjectModel(User.name) userModel: Model<User>) {
  //   this.UserModel = userModel;
  // }

  hashPassword = (planeText: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(planeText, salt)
    return hash;
  }
  async create(createUserDto: CreateUserDto) {
    const hashpassword = this.hashPassword(createUserDto.password)
    let user = await this.UserModel.create({ email: createUserDto.email, password: hashpassword, name: createUserDto.name, address: createUserDto.address })
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    let user = await this.UserModel.findOne({ _id: id })
    return user;
  }

  async findOnebyEmail(email: string) {
    let user = await this.UserModel.findOne({ email: email })
    return user;
  }
  IsvalidcheckUserpassword(password: string, hashpassword: string) {
    return compareSync(password, hashpassword);
  }
  async update(updateUserDto: UpdateUserDto) {
    let user = await this.UserModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
    return user;
  }

  async remove(id: string) {
    return await this.UserModel.deleteOne({ _id: id })
  }
}
