import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class DeleteResumeDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    id: string
}
