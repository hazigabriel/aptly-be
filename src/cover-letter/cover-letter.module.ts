import { Module } from "@nestjs/common"
import { CoverLetterController } from "./cover-letter.controller"
import { CoverLetterService } from "./cover-letter.service"
import { LlmService } from "src/llm/llm.service"
import { ResumeService } from "src/resume/resume.service"
import { JobDescriptionService } from "src/job-description/job-description.service"
import { S3Client } from "@aws-sdk/client-s3"
import { ConfigService } from "@nestjs/config"

@Module({
    controllers: [CoverLetterController],
    providers: [
        CoverLetterService,
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
})
export class CoverLetterModule {}
