import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsString, IsNotEmpty, ValidateNested } from "class-validator"

class JobData {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    positionTitle: string

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    company: string

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    jobDescription: string
}

export class CreateJobDescriptionDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    resumeId: string

    @ApiProperty({
        type: JobData,
    })
    @ValidateNested()
    @Type(() => JobData)
    data: JobData
}
