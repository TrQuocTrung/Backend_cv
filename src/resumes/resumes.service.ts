import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schema/resume.schema';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private Resume: SoftDeleteModel<ResumeDocument>) { }
  async create(createResumeDto: CreateResumeDto, user: IUser) {
    return await this.Resume.create({
      ...createResumeDto, email: user.email, userId: user._id, status: "pending",
      history: [
        {
          status: "PENDING",
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      ],
      createdBy: {
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
    const totalItem = (await this.Resume.find(filter)).length;
    const totalPages = Math.ceil(totalItem / defaultLimit);
    const result = await this.Resume.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error 
      .sort(sort)
      .select(projection as any)
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
    return await this.Resume.findById({ _id: id });
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    const { status } = updateResumeDto;
    return await this.Resume.updateOne({ _id: id }, {
      ...updateResumeDto,
      $push: {
        history: {
          status,
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      }
    })
  }

  remove(id: string) {
    return this.Resume.softDelete({ _id: id });
  }
  getResumebyUserID(user: IUser) {
    return this.Resume.find({ userId: user._id }).sort("-createdAt")
      .populate([
        {
          path: "companyId",
          select: { name: 1 }
        },
        {
          path: "jobId",
          select: { name: 1 }
        }
      ])
  }
}
