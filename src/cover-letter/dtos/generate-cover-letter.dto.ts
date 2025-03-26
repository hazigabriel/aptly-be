import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class GenerateCoverLetterDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    resumeId: string

    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    jobDescriptionId: string
}
