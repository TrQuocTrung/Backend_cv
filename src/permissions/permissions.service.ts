import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permission: SoftDeleteModel<PermissionDocument>) { }
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const existing = await this.permission.findOne({
      apiPath: createPermissionDto.apiPath,
      method: createPermissionDto.method,
    });
    if (existing) {
      throw new ConflictException('Permission with this apiPath and method already exists');
    }
    return await this.permission.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        name: user.name
      }
    }
    );
  }

  async findAll(page: number, limit: number, qs: Record<string, any>) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+page - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItem = (await this.permission.find(filter)).length;
    const totalPages = Math.ceil(totalItem / defaultLimit);
    const result = await this.permission.find(filter)
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
    if (!mongoose.Types.ObjectId.isValid(id))
      return await (this.permission.findOne({ _id: id }).populate({
        path: "permission",
        select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
      }));
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    return await this.permission.updateOne({ _id: id }, {
      ...updatePermissionDto, updatedBy: {
        _id: user._id,
        name: user.name
      }
    });
  }

  async remove(id: string, user: IUser) {
    await this.permission.updateOne({ _id: id }, {
      updatedBy: {
        _id: user._id,
        name: user.name
      }
    });
    return await this.permission.softDelete({ _id: id });
  }
}
