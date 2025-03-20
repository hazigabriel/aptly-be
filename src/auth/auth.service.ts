import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { AuthDto } from "./dto"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import * as nodemailer from "nodemailer"
import { ConfigService } from "@nestjs/config"
import { expiredVerificationEmail, verificationEmail } from "src/emailTemplates"

@Injectable()
export class AuthService {
    private transporter: nodemailer.Transporter

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: this.configService.get("email.user"),
                pass: this.configService.get("email.pass"),
            },
        })
    }

    async register(dto: AuthDto) {
        const hash = await this.hashData(dto.password)
        const emailToken = await this.getEmailVerificationToken(dto.email)
        const userExists = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        })
        if (userExists) throw new ForbiddenException("Email was already used")

        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
                emailVerificationToken: emailToken,
            },
        })

        const tokens = await this.getTokens(newUser.id, newUser.email)
        await this.sendVerificationEmail(dto.email, emailToken)
        await this.updateRtHash(newUser.id, tokens.refresh_token)
        return tokens
    }

    async login(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        })
        if (!user) throw new NotFoundException("User not found")

        const isPasswordMatching = await bcrypt.compare(dto.password, user.password)

        if (!isPasswordMatching) throw new ForbiddenException("Password is incorrect")
        const tokens = await this.getTokens(user.id, user.email)
        await this.updateRtHash(user.id, tokens.refresh_token)
        return tokens
    }

    async logout(userId: string) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRefreshToken: {
                    not: null,
                },
            },
            data: {
                hashedRefreshToken: null,
            },
        })
    }

    async refreshToken(userId: string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
        if (!user) throw new NotFoundException("User not found")
        if (!user.hashedRefreshToken) throw new NotFoundException("No refresh token found")

        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken)

        if (!refreshTokenMatches) throw new ForbiddenException("Access denied")

        const tokens = await this.getTokens(user.id, user.email)
        await this.updateRtHash(user.id, tokens.refresh_token)

        return tokens
    }

    async resendEmailToken(email: string) {
        const emailToken = await this.getEmailVerificationToken(email)

        await this.prisma.user.update({
            where: {
                email,
            },
            data: {
                emailVerificationToken: emailToken,
            },
        })
        await this.sendVerificationEmail(email, emailToken, true)

        return { message: "Token resent successfully", email }
    }

    async confirmEmail(token: string) {
        try {
            const etSecret = this.configService.get<string>("secret.email")

            if (!etSecret) {
                throw new Error("JWT secret (ET_SECRET) is not defined in environment variables.")
            }

            const verifiedToken = this.jwtService.verify(token, { secret: etSecret })

            if (verifiedToken) {
                await this.prisma.user.update({
                    where: {
                        email: verifiedToken.email,
                    },
                    data: {
                        emailVerificationToken: null,
                        isEmailVerified: true,
                    },
                })
            }
            return { message: "Email confirmed successfully", email: verifiedToken.email }
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new UnauthorizedException("Token has expired.")
            } else if (error.name === "JsonWebTokenError") {
                throw new UnauthorizedException("Invalid token.")
            } else {
                throw new UnauthorizedException("An error occurred while processing the token.")
            }
        }
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10)
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

    async getTokens(userId: string, email: string) {
        const atSecret = this.configService.get<string>("secret.access")
        const rtSecret = this.configService.get<string>("secret.refresh")

        if (!atSecret || !rtSecret) {
            throw new Error(
                "JWT secret (AT_SECRET or RT_SECRET) is not defined in environment variables.",
            )
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

    async getEmailVerificationToken(email: string) {
        const etSecret = this.configService.get<string>("secret.email")

        if (!etSecret) {
            throw new Error("JWT secret (ET_SECRET) is not defined in environment variables.")
        }

        const emailToken = await this.jwtService.signAsync(
            {
                email,
            },
            {
                secret: etSecret,
                expiresIn: 60 * 60, // 60 mins
            },
        )

        return emailToken
    }
    async sendVerificationEmail(email: string, token: string, resend: boolean = false) {
        const link = `${this.configService.get<string>("app.frontEndUrl")}/confirm-email/${token}`
        const emailTemplate = resend ? expiredVerificationEmail(link) : verificationEmail(link)

        await this.transporter.sendMail({
            from: this.configService.get<string>("email.user"),
            to: email,
            subject: emailTemplate.subject,
            html: emailTemplate.body,
        })
    }
}
