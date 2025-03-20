import { Body, Controller, Post } from "@nestjs/common"
import { JobDescriptionService } from "./job-description.service"
import { CreateJobDescriptionDto } from "./dtos"

@Controller("job-description")
export class JobDescriptionController {
    constructor(private jobDescriptionService: JobDescriptionService) {}

    @Post()
    addJobDescription(@Body() jobData: CreateJobDescriptionDto) {
        return this.jobDescriptionService.addJobDescription(jobData)
    }
}
