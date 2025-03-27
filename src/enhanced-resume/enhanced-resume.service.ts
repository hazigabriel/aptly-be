import { HttpStatus, Injectable } from "@nestjs/common"
import { JobDescriptionService } from "src/job-description/job-description.service"
import { LlmService } from "src/llm/llm.service"
import { PrismaService } from "src/prisma/prisma.service"
import { ResumeService } from "src/resume/resume.service"
import { GenerateEnhancedResume, GetEnhancedResumesDto } from "./dtos"

@Injectable()
export class EnhancedResumeService {
    constructor(
        private llmService: LlmService,
        private resumeService: ResumeService,
        private jobDescriptionService: JobDescriptionService,
        private prismaService: PrismaService,
    ) {}

    async generateEnhancedResume(data: GenerateEnhancedResume) {
        const resume = await this.resumeService.findOne(data.resumeId)
        const jobDescription = await this.jobDescriptionService.findOne(data.jobDescriptionId)
        const enhancedResumeData = await this.llmService.generateEnhancedResume(
            resume.parsedData,
            jobDescription.data,
        )
        const enhancedResume = await this.prismaService.enhancedResume.create({
            data: {
                jobDescriptionId: data.jobDescriptionId,
                data: enhancedResumeData,
            },
        })

        return enhancedResume
    }

    async getAllEnhancedResumes(data: GetEnhancedResumesDto) {
        const sortDirection: "asc" | "desc" = data.sortDirection || "desc"
        const resumes = await this.prismaService.enhancedResume.findMany({
            where: {
                jobDescriptionId: data.jobDescriptionId,
            },
            orderBy: {
                createdAt: sortDirection,
            },
        })

        return {
            response: resumes,
            statusCode: HttpStatus.OK,
        }
    }

    async deleteEnhancedResume(id: string) {
        await this.prismaService.enhancedResume.delete({
            where: {
                id,
            },
        })

        return {
            response: "Successfully deleted enhanced resume",
            statusCode: HttpStatus.OK,
        }
    }
}
