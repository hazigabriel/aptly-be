import { Module } from "@nestjs/common"
import { JobDescriptionService } from "./job-description.service"
import { JobDescriptionController } from "./job-description.controller"

@Module({
    providers: [JobDescriptionService],
    controllers: [JobDescriptionController],
})
export class JobDescriptionModule {}
