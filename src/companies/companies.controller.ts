import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { use } from 'passport';
import Response from 'superagent/lib/node/response';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  @ResponseMessage("Create New Company")
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser
    // @Req() req: Request
  ) {
    //const user = req.user;
    return this.companiesService.create(createCompanyDto, user)
  }
  @Public()
  @ResponseMessage("Fetch List Company with paginante")
  @Get()
  findAll(@Query("current") page: number, @Query("pageSize") limit: number,
    @Query() qs: Record<string, any>) {

    return this.companiesService.findAll(+page, +limit, qs);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch()
  update(@Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    return this.companiesService.update(updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() use: IUser) {
    return this.companiesService.remove(id, use);
  }
}
