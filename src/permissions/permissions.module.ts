import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionShema } from './schema/permission.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Permission.name, schema: PermissionShema }])],

  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule { }
