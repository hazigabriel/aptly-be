import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsOptional, IsIn } from "class-validator"

export class GetCoverLettersDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    jobDescriptionId: string

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
