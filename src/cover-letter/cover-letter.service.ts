import { HttpStatus, Injectable } from "@nestjs/common"
import { LlmService } from "src/llm/llm.service"
import { GenerateCoverLetterDto, GetCoverLettersDto } from "./dtos"
import { ResumeService } from "src/resume/resume.service"
import { JobDescriptionService } from "src/job-description/job-description.service"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class CoverLetterService {
    constructor(
        private llmService: LlmService,
        private resumeService: ResumeService,
        private jobDescriptionService: JobDescriptionService,
        private prismaService: PrismaService,
    ) {}

    async generateCoverLetter(data: GenerateCoverLetterDto) {
        const resume = await this.resumeService.findOne(data.resumeId)
        const jobDescription = await this.jobDescriptionService.findOne(data.jobDescriptionId)
        const coverLetterData = await this.llmService.generateCoverLetter(
            resume.parsedData,
            jobDescription.data,
        )
        const coverLetter = await this.prismaService.coverLetter.create({
            data: {
                jobDescriptionId: data.jobDescriptionId,
                data: JSON.stringify(coverLetterData),
            },
        })

        return coverLetter
    }

    async getAllCoverLetters(data: GetCoverLettersDto) {
        const sortDirection: "asc" | "desc" = data.sortDirection || "desc"
        const resumes = await this.prismaService.coverLetter.findMany({
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

    async deleteCoverLetter(id: string) {
        await this.prismaService.coverLetter.delete({
            where: {
                id,
            },
        })

        return {
            response: "Successfully deleted cover letter",
            statusCode: HttpStatus.OK,
        }
    }
}
