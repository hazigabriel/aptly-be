import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class DeleteJobDescriptionDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    id: string
}
