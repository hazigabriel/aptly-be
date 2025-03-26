import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class DeleteCoverLetterDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    id: string
}
