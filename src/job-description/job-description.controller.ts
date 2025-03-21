import { Body, Controller, Post, Get, Query } from "@nestjs/common"
import { JobDescriptionService } from "./job-description.service"
import { CreateJobDescriptionDto } from "./dtos"
import { GetJobDescriptionsByResumeDto } from "./dtos/get-jd-by-resume.dto"

@Controller("job-description")
export class JobDescriptionController {
    constructor(private jobDescriptionService: JobDescriptionService) {}

    @Post()
    addJobDescription(@Body() jobData: CreateJobDescriptionDto) {
        return this.jobDescriptionService.addJobDescription(jobData)
    }

    @Get("by-resume")
    getJobDescriptionsByResume(@Query() data: GetJobDescriptionsByResumeDto) {
        return this.jobDescriptionService.getByResume(data)
    }
}
