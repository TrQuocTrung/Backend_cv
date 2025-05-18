import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateCompanyDto {

    @IsNotEmpty({ message: "Name is not empty" })
    name: string;
    @IsNotEmpty({ message: "Address is not empty" })
    address: string;
    @IsNotEmpty({ message: "Descript is not empty" })
    description: string;
    @IsString()
    logo: string
}
