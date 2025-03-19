import { Controller, UploadedFile, UseInterceptors } from "@nestjs/common"
import { Post, Body } from "@nestjs/common"
import { GetCurrentUserId } from "src/auth/decorators"
import { ResumeService } from "./resume.service"
import { FileInterceptor } from "@nestjs/platform-express"
import { ResumeValidationPipe } from "./pipes/resume-validation.pipe"

@Controller("resume")
export class ResumeController {
    constructor(private resumeService: ResumeService) {}

    @Post("upload-file")
    @UseInterceptors(FileInterceptor("file"))
    createResumeWithFile(
        @UploadedFile(new ResumeValidationPipe()) file: Express.Multer.File,
        @GetCurrentUserId() userId: string,
        @Body("resumeName") resumeName: string,
    ) {
        return this.resumeService.createResumeWithFile(userId, file, resumeName)
    }
}
