import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsString, IsNotEmpty, IsOptional, IsInt, IsIn } from "class-validator"

export class GetJobDescriptionsByResumeDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    resumeId: string

    @ApiProperty({
        type: Number,
        required: false,
        default: 1,
    })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    pageNumber: number

    @ApiProperty({
        type: Number,
        required: false,
        default: 20,
    })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    pageSize: number

    @ApiProperty({
        type: Number,
        required: false,
        default: "desc",
        enum: ["asc", "desc"],
    })
    @IsString()
    @IsOptional()
    @IsIn(["asc", "desc"])
    sortDirection: "asc" | "desc"
}
