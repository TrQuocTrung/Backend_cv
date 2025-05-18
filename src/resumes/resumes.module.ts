import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, Resumechema } from './schema/resume.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Resume.name, schema: Resumechema }])],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule { }
