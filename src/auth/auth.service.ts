import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { use } from 'passport';
import { Response } from 'express'
import { RolesService } from 'src/roles/roles.service';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private roleService: RolesService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {

        const user = await this.usersService.findOnebyEmail(username);
        if (user) {
            const isValid = await this.usersService.IsvalidcheckUserpassword(password, user.password);
            if (isValid === true) {
                const userRole = user.role as unknown as { _id: string; name: string };
                const temp = await this.roleService.findOne(userRole._id);
                const objUser = {
                    ...user.toObject(),
                    permission: temp?.permissions ?? []
                }
                return objUser;
            }
        }
        return null;
    }
    async login(user: IUser, response) {

        const { _id, name, email, role, permission } = user;
        const payload = {
            sub: "Token Login",
            iss: "From Server",
            _id, name, email, role
        };
        const refresh_token = this.createRefreshToken(payload)
        await this.usersService.updateUserToken(refresh_token, _id);
        response.cookie('refresh_token', refresh_token,
            {
                httpOnly: true,
                maxAge: 86400000
            })
        return {
            access_token: this.jwtService.sign(payload),
            user: { _id, name, email, role, permission },
            refresh_token
        };
    }
    async handleRegisterUser(registerUser: RegisterUserDto) {
        const result = await this.usersService.registerUser(registerUser);
        return result;
    }
    createRefreshToken = (payload) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_CECRET"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRED")
        })
        return refresh_token;
    }
    async processNewToken(refresh_token: string, response: Response) {
        try {
            this.jwtService.verify(refresh_token, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_CECRET")
            })
            let user = await this.usersService.finduserByToken(refresh_token);

            if (user) {
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "Token Login",
                    iss: "From Server",
                    _id, name, email, role
                };
                const refresh_token = this.createRefreshToken(payload)
                await this.usersService.updateUserToken(refresh_token, _id.toString());
                const userRole = user.role as unknown as { _id: string, name: string };
                const temp = await this.roleService.findOne(userRole._id)
                response.clearCookie('refresh_token');
                response.cookie('refresh_token', refresh_token,
                    {
                        httpOnly: true,
                        maxAge: 86400000
                    })
                return {
                    access_token: this.jwtService.sign(payload),
                    user: { _id, name, email, role, permission: temp?.permissions ?? [] },
                    refresh_token
                };
            } else {
                throw new BadRequestException('Thông Tin User Không Tồn Tại')

            }
        } catch (error) {
            throw new BadRequestException('Refresh Token Đã Hết Hạn Vui Lòng Login')
        }
    }
    async logout(response: Response, user: IUser) {
        await this.usersService.updateUserToken("", user._id)
        response.clearCookie("fresh_token");
        return "OK"
    }
}
