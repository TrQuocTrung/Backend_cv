import { Type } from 'class-transformer';
import { IsDefined, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import mongoose, { Types } from 'mongoose';
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty()
    name: string;
}
export class CreateUserDto {
    @IsNotEmpty({ message: "Name is not empty" })
    name: string;

    @IsEmail()
    @IsNotEmpty({ message: "Email is not empty" })
    email: string;

    @IsNotEmpty({ message: "Password is not empty" })
    password: string;

    @IsNotEmpty({ message: "Email is not empty" })
    age: string;

    @IsNotEmpty({ message: "Gender is not empty" })
    gender: number;

    @IsNotEmpty({ message: "Role is not empty" })
    @IsMongoId()
    role: Types.ObjectId;
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company!: Company;
    address: string;
}
export class RegisterUserDto {
    @IsNotEmpty({ message: "Name is not empty" })
    name: string;

    @IsEmail()
    @IsNotEmpty({ message: "Email is not empty" })
    email: string;

    @IsNotEmpty({ message: "Password is not empty" })
    password: string;

    @IsNotEmpty({ message: "Age is not empty" })
    age: string;

    @IsNotEmpty({ message: "Gender is not empty" })
    gender: number;

    @IsNotEmpty({ message: "Role is not empty" })
    @IsMongoId({ message: "Định Dạng là mongo ID" })
    role: string;

    address: string;
}
