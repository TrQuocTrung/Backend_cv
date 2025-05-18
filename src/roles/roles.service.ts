import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { throwError } from 'rxjs';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }
  async create(createRoleDto: CreateRoleDto) {
    const existing = await this.roleModel.findOne({ name: createRoleDto.name })
    if (existing) {
      throw new ConflictException('Name Đã Tồn Tại');
    }
    return await this.roleModel.create({ ...createRoleDto });
  }

  async findAll(page: number, limit: number, qs: Record<string, any>) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+page - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItem = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItem / defaultLimit);
    const result = await this.roleModel.find(filter)
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
    return await this.roleModel.findById({ _id: id });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    // const existing = await this.roleModel.findOne({ name: updateRoleDto.name })
    // if (existing) {
    //   throw new ConflictException('Name Đã Tồn Tại');
    // }
    return await this.roleModel.updateOne({ _id: id }, {
      ...updateRoleDto,
      updatedBy: {
        _id: user._id,
        name: user.name
      }
    });
  }

  async remove(id: string, user: IUser) {
    const foundRole = await this.roleModel.findById({ _id: id })
    if (foundRole!.name === "ADMIN") {
      throw new BadRequestException("Không Thể Xóa Role ADMIN")
    }
    await this.roleModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: id,
        name: user
      }
    })
    return await this.roleModel.softDelete({ _id: id })
  }
}
