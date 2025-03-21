import { HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateJobDescriptionDto } from "./dtos"
import { GetJobDescriptionsByResumeDto } from "./dtos/get-jd-by-resume.dto"

@Injectable()
export class JobDescriptionService {
    constructor(private prisma: PrismaService) {}

    async addJobDescription(jobData: CreateJobDescriptionDto) {
        const jobDescriptionEntity = await this.prisma.jobDescription.create({
            data: {
                resumeId: jobData.resumeId,
                data: { ...jobData.data },
            },
        })

        return {
            response: jobDescriptionEntity,
            statusCode: HttpStatus.OK,
        }
    }

    async getByResume(data: GetJobDescriptionsByResumeDto) {
        const pageSize = Number(data.pageSize) || 20
        const pageNumber = Number(data.pageNumber) || 1
        const sortDirection: "asc" | "desc" = data.sortDirection || "desc"

        const [result, total] = await Promise.all([
            await this.prisma.jobDescription.findMany({
                where: {
                    resumeId: data.resumeId,
                },
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
                orderBy: {
                    createdAt: sortDirection,
                },
            }),
            this.prisma.jobDescription.count({
                where: {
                    resumeId: data.resumeId,
                },
            }),
        ])

        return {
            response: {
                data: result,
                total,
            },
            statusCode: HttpStatus.OK,
        }
    }
}
