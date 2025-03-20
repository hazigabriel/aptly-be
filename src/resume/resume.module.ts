import { Module } from "@nestjs/common"
import { ResumeController } from "./resume.controller"
import { ResumeService } from "./resume.service"
import { S3Client } from "@aws-sdk/client-s3"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { APP_GUARD } from "@nestjs/core"
import { ConfigService } from "@nestjs/config"

@Module({
    imports: [
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000, // time in ms
                    limit: 10,
                },
            ],
        }),
    ],
    controllers: [ResumeController],
    providers: [
        ResumeService,
        {
            provide: "S3_CLIENT",
            useFactory: (configService: ConfigService) => {
                return new S3Client({
                    region: configService.get<string>("aws.region"),
                })
            },
            inject: [ConfigService],
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class ResumeModule {}
