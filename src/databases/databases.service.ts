import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/companies/schemas/company.schema';
import { Permission, PermissionDocument } from 'src/permissions/schema/permission.schema';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { INIT_PERMISSIONS, ADMIN_ROLE, USER_ROLE } from './sampleData'
import { Logger } from '@nestjs/common';
@Injectable()
export class DatabasesService {
    private readonly logger = new Logger(DatabasesService.name)
    constructor(
        @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
        @InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>,
        @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
        private configService: ConfigService,
        private userService: UsersService,

    ) { }
    async onModuleInit() {
        const isInit = this.configService.get<string>("SHOULD_INIT")
        if (Boolean(isInit)) {
            const countUser = await this.UserModel.count({});
            const countPermission = await this.permissionModel.count({});
            const countRole = await this.roleModel.count({});
            if (countPermission === 0) {
                await this.permissionModel.insertMany(INIT_PERMISSIONS)
            }
            if (countRole === 0) {
                const permissions = (await this.permissionModel.find({}).select("_id"));
                await this.roleModel.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: "Admin full permission",
                        isActive: true,
                        permissions: permissions
                    },
                    {

                        name: USER_ROLE,
                        description: "User using system",
                        isActive: true,
                        permissions: []//Không cấp quyền
                    }
                ])
            }
            if (countUser === 0) {
                const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
                const userRole = await this.roleModel.findOne({ name: USER_ROLE })
                await this.UserModel.insertMany([
                    {
                        name: "I'm Admin",
                        email: "Admin@gmail.com",
                        password: await this.userService.hashPassword(this.configService.get<string>("INIT_PASSWORD")!),
                        age: 30,
                        gender: "MALE",
                        address: "Hà Nội",
                        role: adminRole?._id
                    },
                    {
                        name: "I'm Admin 1",
                        email: "trung147722@gmail.com",
                        password: await this.userService.hashPassword(this.configService.get<string>("INIT_PASSWORD")!),
                        age: 30,
                        gender: "MALE",
                        address: "Hà Nội",
                        role: adminRole?._id
                    },
                    {
                        name: "I'm User",
                        email: "User@gmail.com",
                        password: await this.userService.hashPassword(this.configService.get<string>("INIT_PASSWORD")!),
                        age: 30,
                        gender: "MALE",
                        address: "Hà Nội",
                        role: userRole?._id
                    }
                ])
            }

            if (countPermission > 0 && countRole > 0 && countUser > 0) {
                this.logger.log(">>ALREADY INIT SAMPLE DATA")
            }
        }
    }
}
