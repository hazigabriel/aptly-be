import { Controller, Delete, Param, Query, UploadedFile, UseInterceptors } from "@nestjs/common"
import { Post, Get, Body } from "@nestjs/common"
import { GetCurrentUserId } from "src/auth/decorators"
import { ResumeService } from "./resume.service"
import { FileInterceptor } from "@nestjs/platform-express"
import { ResumeValidationPipe } from "./pipes/resume-validation.pipe"
import { ApiParam } from "@nestjs/swagger"
import { CreateResumeDto, GetUserResumesDto } from "./dtos"

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
    getUserResumes(@GetCurrentUserId() userId: string, @Query() queryData: GetUserResumesDto) {
        return this.resumeService.getUserResumes(userId, queryData)
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
