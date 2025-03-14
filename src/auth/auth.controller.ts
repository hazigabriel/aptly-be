import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthDto } from "./dto"
import { Tokens } from "./types"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    register(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.register(dto)
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.login(dto)
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("logout")
    @HttpCode(HttpStatus.OK)
    logout(@Req() req: Request) {
        const user = req.user as { sub: string }

        return this.authService.logout(user.sub)
    }

    @UseGuards(AuthGuard("jwt-refresh"))
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    refreshToken(@Req() req: Request) {
        const user = req.user as { sub: string; refreshToken: string }

        return this.authService.refreshToken(user.sub, user.refreshToken)
    }
}
