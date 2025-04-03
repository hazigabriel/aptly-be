import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Res,
    Req,
    UnauthorizedException,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthDto } from "./dto"
import { AccessToken } from "./types"
import { RefreshTokenGuard, RequestWithCookies } from "./guards"
import { GetCurrentUser, GetCurrentUserId, Public } from "./decorators"
import { Response, Request } from "express"
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post("register")
    register(
        @Body() dto: AuthDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AccessToken> {
        return this.authService.register(dto, res)
    }

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response): Promise<AccessToken> {
        return this.authService.login(dto, res)
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    logout(
        @GetCurrentUserId() userId: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<Record<string, string>> {
        return this.authService.logout(userId, res)
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    refreshToken(
        @GetCurrentUserId() userId: string,
        @Req() req: RequestWithCookies,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.refreshToken(userId, req, res)
    }

    @Public()
    @Post("resend-email-token")
    @HttpCode(HttpStatus.OK)
    resendEmailToken(@Body("email") email: string) {
        return this.authService.resendEmailToken(email)
    }

    @Public()
    @Post("confirm-email")
    @HttpCode(HttpStatus.OK)
    confirmEmail(@Body("token") token: string) {
        return this.authService.confirmEmail(token)
    }
}
