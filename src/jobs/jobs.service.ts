import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import { Job, JOBDocument } from './schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private Jobs: SoftDeleteModel<JOBDocument>) { }
  async create(createJobDto: CreateJobDto) {
    return await this.Jobs.create({
      ...createJobDto
    })
  }

  async findAll(page: number, limit: number, qs: Record<string, any>) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+page - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItem = (await this.Jobs.find(filter)).length;
    const totalPages = Math.ceil(totalItem / defaultLimit);
    const result = await this.Jobs.find(filter)
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

  findOne(id: string) {
    return this.Jobs.findById({ _id: id })
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    return await this.Jobs.updateOne({ _id: id }, {
      ...updateJobDto, updatedBy: {
        _id: user._id,
        name: user.name
      }
    })
  }

  async remove(id: string, user: IUser) {
    await this.Jobs.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        name: user.name
      }
    })
    return await this.Jobs.softDelete({ _id: id })
  }
}
