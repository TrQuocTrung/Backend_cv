import { IsString } from "class-validator";

export class CreatePermissionDto {
    @IsString({ message: "Permission Name Is Not" })
    name: string;

    @IsString({ message: "APIPath Is Not" })
    apiPath: string;

    @IsString({ message: "Medthod Name Is Not" })
    method: string;

    @IsString({ message: "Module Name Is Not" })
    module: string;


}
