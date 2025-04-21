import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsOptional } from "class-validator"

export class CreateResumeDto {
    @ApiProperty({
        description: "The parsed resume data",
        type: "string",
    })
    @IsNotEmpty()
    parsedData: object

    @ApiProperty({
        description: "The resume file to upload",
        type: "string",
        format: "binary",
    })
    @IsOptional()
    file: Express.Multer.File

    @ApiProperty({
        description: "The name of the resume",
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    resumeName: string
}
