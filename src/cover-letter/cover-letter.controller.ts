import { Body, Controller, Post, Get, Delete, Query } from "@nestjs/common"
import { CoverLetterService } from "./cover-letter.service"
import { GenerateCoverLetterDto, GetCoverLettersDto, DeleteCoverLetterDto } from "./dtos"

@Controller("cover-letter")
export class CoverLetterController {
    constructor(private coverLetterService: CoverLetterService) {}
    @Post()
    handleGenerateCoverLetter(@Body() data: GenerateCoverLetterDto) {
        return this.coverLetterService.generateCoverLetter(data)
    }

    @Get()
    handleGetAllCoverLetters(@Query() data: GetCoverLettersDto) {
        return this.coverLetterService.getAllCoverLetters(data)
    }

    @Delete()
    handleDeleteCoverLetter(@Body() data: DeleteCoverLetterDto) {
        return this.coverLetterService.deleteCoverLetter(data.id)
    }
}
