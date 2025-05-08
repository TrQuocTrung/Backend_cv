import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty({ message: "Email is not empty" })
    email: string;
    @IsNotEmpty()
    password: string;
    name: string;
    address: string;
}
