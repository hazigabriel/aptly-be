import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        const secret = process.env.AT_SECRET
        if (!secret) {
            throw new Error("JWT secret (AT_SECRET) is not defined in environment variables.")
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        })
    }
    validate(payload: any) {
        return payload
    }
}
