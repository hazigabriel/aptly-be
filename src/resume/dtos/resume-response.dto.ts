import { Expose } from "class-transformer"

export class ResumeResponseDto {
    @Expose()
    id: string

    @Expose()
    resumeName: string

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    @Expose()
    fileUrl: string
}
