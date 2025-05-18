import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage("Create a new resume")
  async create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    let result = await this.resumesService.create(createResumeDto, user);
    return {
      data: {
        "_id": result._id,
        "createdAt": result.createdAt
      }
    }
  }

  @Get()
  @ResponseMessage("Fetch all resumes with paginate")
  findAll(@Query("current") page: number, @Query("pageSize") limit: number,
    @Query() qs: Record<string, any>) {
    return this.resumesService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch a resume by id")
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Post('/by-user')
  @ResponseMessage("Get Resumes by User")
  getResumebyUser(@User() user: IUser) {
    return this.resumesService.getResumebyUserID(user);
  }

  @ResponseMessage("Update status resume")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto, @User() user: IUser) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumesService.remove(id);
  }
}
