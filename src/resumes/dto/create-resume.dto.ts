import { IsEnum, IsMongoId, IsNotEmpty, IsUrl } from "class-validator";

export enum ResumeStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}
export class CreateResumeDto {
    @IsNotEmpty({ message: 'URL không được để trống' })
    url: string;

    @IsNotEmpty({ message: "Trạng Thái Không Hợp Lệ" })
    @IsEnum(ResumeStatus)
    status: string;

    @IsNotEmpty({ message: 'companyId không được để trống' })
    @IsMongoId({ message: 'companyId phải là ObjectId hợp lệ' })
    companyId: string;

    @IsNotEmpty({ message: 'jobId không được để trống' })
    @IsMongoId({ message: 'jobId phải là ObjectId hợp lệ' })
    jobId: string;
}
