import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, Roleschema } from './schema/role.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: Roleschema }])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule { }
