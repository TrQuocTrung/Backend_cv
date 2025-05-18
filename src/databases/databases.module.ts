import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Permission, PermissionShema } from 'src/permissions/schema/permission.schema';
import { Role, Roleschema } from 'src/roles/schema/role.schema';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionShema },
      { name: Role.name, schema: Roleschema }
    ])
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService, UsersService, RolesService],
})
export class DatabasesModule { }
