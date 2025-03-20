import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Request } from "express"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(configService: ConfigService) {
        const secret = configService.get<string>("secret.refresh")
        if (!secret) {
            throw new Error("JWT secret (RT_SECRET) is not defined in environment variables.")
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            passReqToCallback: true,
        })
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.get("authorization")?.replace("Bearer", "").trim()

        return {
            ...payload,
            refreshToken,
        }
    }
}
