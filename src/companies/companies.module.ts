import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Companies, CompaniesSchema } from './schemas/company.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Companies.name, schema: CompaniesSchema }])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule { }
