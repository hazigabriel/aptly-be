import {
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3"
import {
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PrismaService } from "src/prisma/prisma.service"
import { plainToInstance } from "class-transformer"
import { GetUserResumesDto, ResumeResponseDto } from "./dtos"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ResumeService {
    constructor(
        private configService: ConfigService,
        @Inject("S3_CLIENT")
        private readonly s3Client = new S3Client({
            region: configService.get<string>("aws.region"),
        }),
        private prisma: PrismaService,
    ) {}

    async createResumeWithFile(userId: string, file: Express.Multer.File, resumeName: string) {
        const fileKey = `resumes/${new Date().getTime()}|${file.originalname}`
        await this.uploadFileToS3(fileKey, file)
        const presignedUrl = await this.generateFilePresignedUrl(fileKey)

        const newResume = await this.prisma.resume.create({
            data: {
                userId: userId,
                resumeName,
                awsFileKey: fileKey,
            },
        })
        return {
            response: { ...newResume, fileUrl: presignedUrl },
            statusCode: HttpStatus.OK,
        }
    }

    async getUserResumes(userId: string, queryData: GetUserResumesDto) {
        const sortDirection: "asc" | "desc" = queryData.sortDirection || "desc"
        const resumes = await this.prisma.resume.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: sortDirection,
            },
        })
        const transformedResumes = await Promise.all(
            resumes.map(async resume => {
                const fileUrl = resume.awsFileKey
                    ? await this.generateFilePresignedUrl(resume.awsFileKey)
                    : null

                return {
                    ...plainToInstance(ResumeResponseDto, resume, {
                        excludeExtraneousValues: true,
                    }),
                    fileUrl: fileUrl,
                }
            }),
        )
        return transformedResumes
    }

    async deleteResume(id: string) {
        const resume = await this.prisma.resume.findUnique({
            where: {
                id,
            },
        })
        if (!resume) throw new NotFoundException("Resume not found")
        await this.deleteFileFromS3(resume.awsFileKey as string)
        await this.prisma.resume.delete({
            where: {
                id,
            },
        })
        return {
            response: "Resume deleted succesfully!",
            statusCode: HttpStatus.OK,
        }
    }

    async uploadFileToS3(fileKey: string, file: Express.Multer.File): Promise<void> {
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.configService.get<string>("aws.bucketName"),
                    Key: fileKey,
                    Body: file.buffer,
                }),
            )
        } catch (error) {
            throw new InternalServerErrorException(`Failed to upload file to S3: ${error.message}`)
        }
    }

    async deleteFileFromS3(fileKey: string): Promise<void> {
        try {
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.configService.get<string>("aws.bucketName"),
                    Key: fileKey,
                }),
            )
        } catch (error) {
            throw new InternalServerErrorException(
                `Failed to delete resume from S3: ${error.message}`,
            )
        }
    }

    async generateFilePresignedUrl(
        fileKey: string,
        expiresIn: number = 60 * 60 * 24, // 1 day
    ): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.configService.get<string>("aws.bucketName"),
            Key: fileKey,
        })

        const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn })

        return presignedUrl
    }
}
