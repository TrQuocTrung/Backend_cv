import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {

        const user = await this.usersService.findOnebyEmail(username);
        if (user) {
            const isValid = this.usersService.IsvalidcheckUserpassword(password, user.password);
            if (isValid === true) {
                return user;
            }
        }
        return null;
    }
    async login(user: any) {
        const payload = { username: user.email, sub: user._id, password: user.password };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
