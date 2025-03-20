import { HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateJobDescriptionDto } from "./dtos"

@Injectable()
export class JobDescriptionService {
    constructor(private prismaService: PrismaService) {}

    async addJobDescription(jobData: CreateJobDescriptionDto) {
        const jobDescriptionEntity = await this.prismaService.jobDescription.create({
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
}
