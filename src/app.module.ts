import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { UsersModule } from "./users/users.module"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { APP_GUARD } from "@nestjs/core"
import { AccessTokenGuard } from "./auth/guards"
import { ResumeModule } from './resume/resume.module';

@Module({
    imports: [UsersModule, ConfigModule.forRoot(), AuthModule, PrismaModule, ResumeModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AccessTokenGuard,
        },
    ],
})
export class AppModule {}
