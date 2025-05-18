import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
class CompanyDto {
    @IsMongoId()
    @IsNotEmpty()
    _id: string;

    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    logo: string;
}
export class CreateJobDto {
    @IsNotEmpty()
    name: string;



    @IsNotEmpty()
    skills: string;

    @IsObject()
    @ValidateNested()
    @Type(() => CompanyDto)
    company: CompanyDto;

    @IsString()
    @IsNotEmpty()
    location: string

    @IsNumber()
    salary: number

    @IsNumber()
    quantity: number

    @IsString()
    level: string

    @IsString()
    description: string

    @IsDateString()
    startDate: Date

    @IsDateString()
    endDate: Date

    @IsBoolean()
    isActive: boolean
}
