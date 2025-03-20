import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class CreateResumeDto {
    @ApiProperty({
        description: "The resume file to upload",
        type: "string",
        format: "binary",
    })
    file: Express.Multer.File

    @ApiProperty({
        description: "The name of the resume",
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    resumeName: string
}
