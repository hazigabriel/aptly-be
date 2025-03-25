import { Injectable } from "@nestjs/common"
import { LlmService } from "src/llm/llm.service"
import { GenerateCoverLetterDto } from "./dtos/generate-cover-letter.dto"
import { ResumeService } from "src/resume/resume.service"
import { JobDescriptionService } from "src/job-description/job-description.service"

@Injectable()
export class CoverLetterService {
    constructor(
        private llmService: LlmService,
        private resumeService: ResumeService,
        private jobDescriptionService: JobDescriptionService,
    ) {}

    async generateCoverLetter(data: GenerateCoverLetterDto) {
        const resume = await this.resumeService.findOne(data.resumeId)
        const jobDescription = await this.jobDescriptionService.findOne(data.jobDescriptionId)

        // const coverLetter = await this.llmService.generateCoverLetter(
        //     resume.parsedData,
        //     jobDescription.data,
        // )
    }
}
