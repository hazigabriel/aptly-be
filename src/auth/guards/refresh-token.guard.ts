import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"

import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"

export interface RequestWithCookies extends Request {
    cookies: Record<string, string>
}

@Injectable()
export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {
    getRequest(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<RequestWithCookies>()

        const refreshToken = request.cookies?.refresh_token

        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token not found in cookies")
        }
        
        request.headers.authorization = `Bearer ${refreshToken}`

        return request
    }
}
