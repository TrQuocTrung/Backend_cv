import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { USER_ROLE } from 'src/databases/sampleData';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import path from 'path';
@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private RoleModel: SoftDeleteModel<RoleDocument>
  ) { }
  // private UserModel: Model<User>
  // constructor(@InjectModel(User.name) userModel: Model<User>) {
  //   this.UserModel = userModel; 
  // }

  hashPassword = (planeText: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(planeText, salt)
    return hash;
  }
  async create(createUserDto: CreateUserDto, currentUser: { id: string, email: string }) {
    const hashpassword = await this.hashPassword(createUserDto.password)
    const userRole = await this.RoleModel.findOne({ name: USER_ROLE })
    let user = await this.UserModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashpassword,
      role: userRole?.id,
      age: createUserDto.age,
      gender: createUserDto.gender,
      address: createUserDto.address,
      company: {
        _id: createUserDto.company._id,
        name: createUserDto.company.name
      },
      createdBy: {
        id: currentUser.id,
        email: currentUser.email
      }
    })
    return user;
  }
  async registerUser(registerUserDto: RegisterUserDto) {
    const existingUser = await this.UserModel.findOne({ email: registerUserDto.email }).exec()
    if (existingUser) {
      throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
    }
    const hashpassword = this.hashPassword(registerUserDto.password);
    let user = await this.UserModel.create({
      name: registerUserDto.name,
      email: registerUserDto.email,
      password: hashpassword,
      role: "USER",
      address: registerUserDto.address,
      age: registerUserDto.age,
      gender: registerUserDto.gender
    })
    return user;
  }
  async findAll(page: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pagesize;
    let offset = (+page - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItem = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItem / defaultLimit);
    const result = await this.UserModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error 
      .sort(sort)
      .populate(population)
      .exec();
    return {
      meta: {
        current: page, //trang hiện tại 
        pageSize: limit, //số lượng bản ghi đã lấy 
        pages: totalPages,  //tổng số trang với điều kiện query 
        total: totalItem // tổng số phần tử (số bản ghi) 
      },
      result //kết quả query 
    }
  }

  async findOne(id: string) {
    let user = await this.UserModel.findOne({ _id: id }).select("-password").populate({ path: "role", select: { name: 1 } })
    return user;
  }

  async findOnebyEmail(email: string) {
    let user = await this.UserModel.findOne({ email: email })
      .populate({
        path: "role", select: { name: 1, permissions: 1 }
      })
    return user;
  }
  IsvalidcheckUserpassword(password: string, hashpassword: string) {
    return compareSync(password, hashpassword);
  }
  async update(updateUserDto: UpdateUserDto, currentUser: { id: string, email: string }) {
    let user = await this.UserModel.updateOne(

      { _id: updateUserDto._id },
      {
        ...updateUserDto, updateBy: {
          _id: currentUser.id,
          email: currentUser.email
        }
      })
    return user;
  }

  async remove(id: string, currentUser: { id: string, email: string }) {
    const foundUser = await this.UserModel.findOne({ _id: id })
    if (foundUser!.email === "admin@gmail.com") {
      throw new BadRequestException("Không Thể Xóa Tài Khoản Admin")
    }
    await this.UserModel.updateOne({
      _id: id
    }, {
      _id: currentUser.id,
      email: currentUser.email
    })
    return await this.UserModel.softDelete({ _id: id })
  }
  async updateUserToken(refresh_token: string, _id: string) {
    return await this.UserModel.updateOne({
      _id: _id
    }, { refresh_token })
  }
  async finduserByToken(refresh_token: string) {
    return await this.UserModel.findOne({ refresh_token }).populate({
      path: "role",
      select: { name: 1 }
    })
  }
}
