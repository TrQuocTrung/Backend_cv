import { Controller, Get, Post, Body, Patch, Param, Delete, Response, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage('Create a new Job')
  async create(@Body() createJobDto: CreateJobDto) {
    let result = await this.jobsService.create(createJobDto);
    return {
      data: {
        "_id": result._id,
        "createdAt": result.createdAt
      }
    }
  }
  @Public()
  @Get()
  findAll(@Query("current") page: number, @Query("pageSize") limit: number,
    @Query() qs: Record<string, any>) {
    return this.jobsService.findAll(+page, +limit, qs);
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @ResponseMessage("Update a Job")
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    let result = await this.jobsService.update(id, updateJobDto, user);
    return {
      data: result
    }
  }
  @ResponseMessage("Delete a Job")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    let result = this.jobsService.remove(id, user);
    return result;
  }
}
