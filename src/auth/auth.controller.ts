import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthDto } from "./dto"
import { Tokens } from "./types"
import { RefreshTokenGuard } from "./guards"
import { GetCurrentUser, GetCurrentUserId, Public } from "./decorators"

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post("register")
    register(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.register(dto)
    }

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.login(dto)
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: string) {
        return this.authService.logout(userId)
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    refreshToken(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser("refreshToken") refreshToken: string,
    ) {
        return this.authService.refreshToken(userId, refreshToken)
    }
}
