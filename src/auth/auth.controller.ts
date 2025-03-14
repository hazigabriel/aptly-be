import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthDto } from "./dto"
import { Tokens } from "./types"

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    register(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.register(dto)
    }

    @Post("login")
    login(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.login(dto)
    }

    @Post("logout")
    logout() {
        this.authService.logout()
    }

    @Post("refresh")
    refreshToken() {
        this.authService.refreshToken()
    }
}
