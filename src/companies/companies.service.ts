import { Injectable, Query } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Companies, UserDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Companies.name) private companies: SoftDeleteModel<UserDocument>) { }
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return await this.companies.create({
      ...createCompanyDto, createdBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async findAll(page: number, limit: number, qs: Record<string, any>) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+page - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItem = (await this.companies.find(filter)).length;
    const totalPages = Math.ceil(totalItem / defaultLimit);
    const result = await this.companies.find(filter)
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
    // companies.find(filter)
    //   .skip(skip)
    //   .limit(limit)
    //   .sort(sort)
    //   .select(projection)
    //   .populate(population)
    //   .exec((err, users) => {
    //     if (err) {
    //       return next(err);
    //     }

    //     res.send(users);
    //   });
    //return this.companies.find(filter);
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companies.updateOne({ _id: updateCompanyDto._id }, {
      ...updateCompanyDto, updateBy: {
        _id: user._id,
        user: user.email
      }
    },)
  }

  async remove(id: string, user: IUser) {
    await this.companies.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        user: user.email
      }
    })
    return this.companies.softDelete({ _id: id })
  }
}
