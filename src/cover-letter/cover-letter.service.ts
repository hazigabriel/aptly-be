import { Injectable } from "@nestjs/common"
import { LlmService } from "src/llm/llm.service"
import { GenerateCoverLetterDto } from "./dtos/generate-cover-letter.dto"
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

        if (!resume.parsedData) {
            throw new Error("Resume parsed data is missing or invalid")
        }
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
}
