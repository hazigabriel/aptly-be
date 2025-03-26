import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsIn } from "class-validator"

export class GetUserResumesDto {
    @ApiProperty({
        type: String,
        required: false,
        default: "desc",
        enum: ["asc", "desc"],
    })
    @IsString()
    @IsOptional()
    @IsIn(["asc", "desc"])
    sortDirection: "asc" | "desc"
}
