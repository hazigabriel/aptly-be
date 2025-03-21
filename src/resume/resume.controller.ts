import { Controller, Delete, Param, UploadedFile, UseInterceptors } from "@nestjs/common"
import { Post, Get, Body } from "@nestjs/common"
import { GetCurrentUserId } from "src/auth/decorators"
import { ResumeService } from "./resume.service"
import { FileInterceptor } from "@nestjs/platform-express"
import { ResumeValidationPipe } from "./pipes/resume-validation.pipe"
import { ApiParam } from "@nestjs/swagger"
import { CreateResumeDto } from "./dtos"

@Controller("resume")
export class ResumeController {
    constructor(private resumeService: ResumeService) {}

    @Post("upload-file")
    @UseInterceptors(FileInterceptor("file"))
    createResumeWithFile(
        @UploadedFile(new ResumeValidationPipe()) file: Express.Multer.File,
        @GetCurrentUserId() userId: string,
        @Body() createResumeDto: CreateResumeDto,
    ) {
        return this.resumeService.createResumeWithFile(userId, file, createResumeDto.resumeName)
    }

    @Get("my-resumes")
    getUserResumes(@GetCurrentUserId() userId: string) {
        return this.resumeService.getUserResumes(userId)
    }

    @Delete(":id")
    @ApiParam({
        name: "id",
        type: String,
    })
    deleteResume(@Param("id") id: string) {
        return this.resumeService.deleteResume(id)
    }
}
