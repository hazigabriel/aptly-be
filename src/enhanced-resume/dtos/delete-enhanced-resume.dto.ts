import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class DeleteEnhanceResumeDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    id: string
}
