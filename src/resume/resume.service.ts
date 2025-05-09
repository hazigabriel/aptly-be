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
import { LlmService } from "src/llm/llm.service"
import * as path from "path"
import * as mammoth from "mammoth"
import * as pdfParse from "pdf-parse"

@Injectable()
export class ResumeService {
    constructor(
        private configService: ConfigService,
        @Inject("S3_CLIENT")
        private readonly s3Client = new S3Client({
            region: configService.get<string>("aws.region"),
        }),
        private prisma: PrismaService,
        private llmService: LlmService,
    ) {}

    async createResume(
        userId: string,
        parsedData: object,
        resumeName: string,
        file?: Express.Multer.File,
    ) {
        let fileUrl: string | null = null
        const newResume = await this.prisma.resume.create({
            data: {
                resumeName,
                userId,
                parsedData,
            },
        })

        if (file) {
            const fileKey = `resumes/${Date.now()}|${file.originalname}`
            await this.uploadFileToS3(fileKey, file)
            fileUrl = await this.generateFilePresignedUrl(fileKey)

            await this.prisma.resumeFile.create({
                data: {
                    resumeId: newResume.id,
                    awsFileKey: fileKey,
                    originalResumeName: file.originalname,
                },
            })
        }

        return {
            response: { ...newResume, fileUrl: fileUrl },
            statusCode: HttpStatus.OK,
        }
    }

    async parseResume(file: Express.Multer.File) {
        let rawText: string
        const fileExtension = path.extname(file.originalname).toLocaleLowerCase().replace(".", "")

        if (fileExtension === "pdf") {
            rawText = await this.extractPdfText(file)
        } else {
            rawText = await this.extractWordText(file)
        }

        const parsedResume = await this.llmService.parseRawData(rawText)

        return {
            data: parsedResume,
            statusCode: HttpStatus.OK,
        }
    }

    async getUserResumes(userId: string, queryData: GetUserResumesDto) {
        const sortDirection: "asc" | "desc" = queryData.sortDirection || "desc"
        const resumes = await this.prisma.resume.findMany({
            where: {
                userId,
            },
            include: {
                ResumeFile: true,
            },
            orderBy: {
                createdAt: sortDirection,
            },
        })
        const transformedResumes = await Promise.all(
            resumes.map(async resume => {
                const fileUrl = resume.ResumeFile?.awsFileKey
                    ? await this.generateFilePresignedUrl(resume.ResumeFile?.awsFileKey)
                    : null

                return {
                    ...plainToInstance(ResumeResponseDto, resume, {
                        excludeExtraneousValues: true,
                    }),
                    fileUrl,
                }
            }),
        )
        return transformedResumes
    }

    async findOne(id: string) {
        const resume = await this.prisma.resume.findUnique({
            where: {
                id,
            },
            include: {
                ResumeFile: true,
            },
        })
        if (!resume) throw new NotFoundException("Resume not found")

        return resume
    }
    async deleteResume(id: string) {
        const resume = await this.prisma.resume.findUnique({
            where: {
                id,
            },
            include: {
                ResumeFile: true,
            },
        })

        if (resume?.ResumeFile) {
            await this.deleteFileFromS3(resume.ResumeFile.awsFileKey as string)
        }
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

    async extractPdfText(file: Express.Multer.File) {
        try {
            const data = await pdfParse(file.buffer)
            return data.text
        } catch (error) {
            throw new Error(`Failed to extract text from PDF: ${error.message}`)
        }
    }

    async extractWordText(file: Express.Multer.File) {
        try {
            const data = await mammoth.extractRawText({ buffer: file.buffer })
            return data.value
        } catch (error) {
            throw new Error("Failed to extract text from Word file")
        }
    }
}
