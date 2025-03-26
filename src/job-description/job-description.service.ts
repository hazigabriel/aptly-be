import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import {
    CreateJobDescriptionDto,
    GetJobDescriptionsByResumeDto,
    UpdateJobDescriptionData,
    UpdateJobDescriptionDto,
} from "./dtos"

import { instanceToPlain, plainToInstance } from "class-transformer"

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

    async getByResume(data: GetJobDescriptionsByResumeDto): Promise<object> {
        const pageSize = data.pageSize || 20
        const pageNumber = data.pageNumber || 1
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
    async findOne(id: string) {
        const jobDescription = await this.prisma.jobDescription.findUnique({
            where: {
                id,
            },
        })
        if (!jobDescription) {
            throw new NotFoundException("No Job Descriptioon found with this id")
        }

        return jobDescription
    }

    async updateJobDescription(dto: UpdateJobDescriptionDto) {
        const data = plainToInstance(UpdateJobDescriptionData, dto.data, {
            excludeExtraneousValues: true,
            //ensure no new properties are passed
        })

        //try to find jd and throw err if it doesn't exist
        await this.findOne(dto.id)

        const newJobDescription = await this.prisma.jobDescription.update({
            where: {
                id: dto.id,
            },
            data: {
                data: instanceToPlain(data),
            },
        })

        return {
            response: newJobDescription,
            statusCode: HttpStatus.OK,
        }
    }

    async deleteJobDescription(id: string) {
        await this.findOne(id)

        await this.prisma.jobDescription.delete({
            where: {
                id,
            },
        })

        return {
            response: "Job description was succesfully deleted",
            statusCode: HttpStatus.OK,
        }
    }
}
