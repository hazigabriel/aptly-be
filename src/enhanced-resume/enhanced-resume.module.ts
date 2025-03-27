import { Module } from "@nestjs/common"
import { EnhancedResumeService } from "./enhanced-resume.service"
import { EnhancedResumeController } from "./enhanced-resume.controller"
import { LlmService } from "src/llm/llm.service"
import { ResumeService } from "src/resume/resume.service"
import { JobDescriptionService } from "src/job-description/job-description.service"
import { S3Client } from "@aws-sdk/client-s3"
import { ConfigService } from "@nestjs/config"

@Module({
    providers: [
        EnhancedResumeService,
        LlmService,
        ResumeService,
        JobDescriptionService,
        {
            provide: "S3_CLIENT",
            useFactory: (configService: ConfigService) => {
                return new S3Client({
                    region: configService.get<string>("aws.region"),
                })
            },
            inject: [ConfigService],
        },
    ],
    controllers: [EnhancedResumeController],
})
export class EnhancedResumeModule {}
