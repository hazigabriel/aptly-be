import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { UsersModule } from "./users/users.module"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { APP_GUARD } from "@nestjs/core"
import { AccessTokenGuard } from "./auth/guards"
import { ResumeModule } from "./resume/resume.module"
import { JobDescriptionModule } from "./job-description/job-description.module"
import { LlmService } from "./llm/llm.service"
import envConfiguration from "./config/envConfiguration"

@Module({
    imports: [
        UsersModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
            load: [envConfiguration],
        }),
        AuthModule,
        PrismaModule,
        ResumeModule,
        JobDescriptionModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AccessTokenGuard,
        },
        LlmService,
    ],
})
export class AppModule {}
