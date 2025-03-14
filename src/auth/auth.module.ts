import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategies"
import { JwtModule } from "@nestjs/jwt"

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, RefreshTokenStrategy, AccessTokenStrategy],
})
export class AuthModule {}
