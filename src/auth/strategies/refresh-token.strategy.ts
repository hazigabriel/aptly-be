import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Request } from "express"
import { Injectable } from "@nestjs/common"

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        const secret = process.env.RT_SECRET
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
