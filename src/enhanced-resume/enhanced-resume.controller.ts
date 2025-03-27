import { Body, Controller, Post, Get, Delete, Query } from "@nestjs/common"
import { EnhancedResumeService } from "./enhanced-resume.service"
import { DeleteEnhanceResumeDto, GenerateEnhancedResume, GetEnhancedResumesDto } from "./dtos"

@Controller("enhanced-resume")
export class EnhancedResumeController {
    constructor(private enhancedResumeService: EnhancedResumeService) {}
    @Post()
    handleGenerateEnhancedResume(@Body() data: GenerateEnhancedResume) {
        return this.enhancedResumeService.generateEnhancedResume(data)
    }

    @Get()
    handleGetAllEnhancedResumes(@Query() data: GetEnhancedResumesDto) {
        return this.enhancedResumeService.getAllEnhancedResumes(data)
    }

    @Delete()
    handleDeleteEnhancedResume(@Body() data: DeleteEnhanceResumeDto) {
        return this.enhancedResumeService.deleteEnhancedResume(data.id)
    }
}
