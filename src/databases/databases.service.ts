import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/companies/schemas/company.schema';
import { Permission, PermissionDocument } from 'src/permissions/schema/permission.schema';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabasesService {
    constructor(
        @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
        @InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>,
        @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
        private configService: ConfigService,
        private userService: UsersService
    ) { }
    async onModuleInit() {
        const isInit = this.configService.get<string>("SHOULD_INIT")
        if (Boolean(isInit)) {
            const countUser = await this.UserModel.count({});
            const countPermission = await this.permissionModel.count({});
            const countRole = await this.roleModel.count({});
            if (countUser === 0) {

            }
            if (countPermission === 0) {

            }
            if (countRole === 0) {

            }
        }
    }
}
