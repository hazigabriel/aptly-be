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

    async getByResume(data: GetJobDescriptionsByResumeDto) {
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

    async updateJobDescription(dto: UpdateJobDescriptionDto) {
        const data = plainToInstance(UpdateJobDescriptionData, dto.data, {
            excludeExtraneousValues: true,
            //ensure no new properties are passed
        })
        const jobDescriptionExits = await this.prisma.jobDescription.findUnique({
            where: {
                id: dto.id,
            },
        })

        if (!jobDescriptionExits) {
            throw new NotFoundException("No Job Descriptioon found with this id")
        }

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
        const jobDescriptionExits = await this.prisma.jobDescription.findUnique({
            where: {
                id,
            },
        })

        if (!jobDescriptionExits) {
            throw new NotFoundException("No Job Descriptioon found with this id")
        }

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
