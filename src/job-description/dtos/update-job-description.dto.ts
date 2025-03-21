import { ApiProperty } from "@nestjs/swagger"
import { Type, Expose } from "class-transformer"
import { IsString, IsNotEmpty, ValidateNested } from "class-validator"

export class UpdateJobDescriptionData {
    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsNotEmpty()
    @Expose()
    positionTitle: string

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsNotEmpty()
    @Expose()
    company: string

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsNotEmpty()
    @Expose()
    jobDescription: string
}

export class UpdateJobDescriptionDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Expose()
    id: string

    @ApiProperty({
        type: UpdateJobDescriptionData,
    })
    @ValidateNested()
    @Type(() => UpdateJobDescriptionData)
    data: UpdateJobDescriptionData
}
