import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { AuthDto } from "./dto"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async register(dto: AuthDto) {
        const hash = await this.hashData(dto.password)
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
            },
        })

        const tokens = await this.getTokens(newUser.id, newUser.email)
        await this.updateRtHash(newUser.id, tokens.refresh_token)
        return tokens
    }

    async updateRtHash(userId: string, refreshToken: string) {
        const hashedRt = await this.hashData(refreshToken)

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRefreshToken: hashedRt,
            },
        })
    }
    login() {}

    logout() {}

    refreshToken() {}

    hashData(data: string) {
        return bcrypt.hash(data, 10)
    }

    async getTokens(userId: string, email: string) {
        const atSecret = process.env.AT_SECRET
        const rtSecret = process.env.RT_SECRET

        if (!atSecret || !rtSecret) {
            throw new Error("JWT secret (AT_SECRET) is not defined in environment variables.")
        }
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: atSecret,
                    expiresIn: 60 * 15, // 15 mins
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: rtSecret,
                    expiresIn: 60 * 60 * 24 * 7, // 1 week
                },
            ),
        ])

        return {
            access_token: at,
            refresh_token: rt,
        }
    }
}
