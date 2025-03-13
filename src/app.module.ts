import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { UsersModule } from "./users/users.module"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./users/entities/user.entity"

@Module({
    imports: [
        UsersModule,
        ConfigModule.forRoot(),
        AuthModule,
        TypeOrmModule.forRootAsync({
            useFactory: () => {
                return {
                    type: "postgres",
                    url: process.env.DATABASE_URL,
                    ssl: true,
                    entities: [User],
                    synchronize: true,

                }
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
