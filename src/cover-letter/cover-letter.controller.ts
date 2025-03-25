import { Controller, Post } from "@nestjs/common"
import { CoverLetterService } from "./cover-letter.service"
import { GenerateCoverLetterDto } from "./dtos/generate-cover-letter.dto"

@Controller("cover-letter")
export class CoverLetterController {
    constructor(private coverLetterService: CoverLetterService) {}
    @Post()
    handleGenerateResume(data: GenerateCoverLetterDto) {
        return this.coverLetterService.generateCoverLetter(data)
    }
}
