import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class GenerateEnhancedResume {
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
