import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Permission, PermissionShema } from 'src/permissions/schema/permission.schema';
import { Role, Roleschema } from 'src/roles/schema/role.schema';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionShema },
      { name: Role.name, schema: Roleschema }
    ]),
    UsersModule
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService, UsersService, RolesService, PermissionsService],
})
export class DatabasesModule { }
