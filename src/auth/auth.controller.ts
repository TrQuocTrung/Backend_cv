import { Controller, Get, Post, Render, UseGuards, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IUser } from 'src/users/user.interface';
import { Request, Response } from 'express';

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }
    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage("User Login")
    @Post('/login')
    handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }
    @Public()
    @Post('register')
    @ResponseMessage("Register a new user")
    async handleRegister(@Body() @Req() req) {
        let user = await this.authService.handleRegisterUser(req);
        return {
            _id: user._id,
            createdAt: user.createdAt
        };
    }
    @ResponseMessage("Get user information")
    @Get('/account')
    getProfileuser(@User() user: IUser) {
        return user;
    }
    @Public()
    @ResponseMessage("Get User By Freshesh token")
    @Get('/refresh')
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refresh_token = request.cookies['refresh_token'];
        return this.authService.processNewToken(refresh_token, response);
    }

    @Post('/logout')
    @ResponseMessage("Logout User")
    handleLogout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
        return this.authService.logout(response, user)
    }

}
