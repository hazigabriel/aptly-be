import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(configService: ConfigService) {
        const secret = configService.get<string>("secret.access")
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
