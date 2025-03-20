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
import { ResumeResponseDto } from "./dtos"

@Injectable()
export class ResumeService {
    constructor(
        @Inject("S3_CLIENT")
        private readonly s3Client = new S3Client({
            region: process.env.AWS_S3_REGION,
        }),
        private prisma: PrismaService,
    ) {}

    async createResumeWithFile(userId: string, file: Express.Multer.File, resumeName: string) {
        const fileKey = `resumes/${new Date().getTime()}|${file.originalname}`
        const bucketName: string = "aptly-be"
        await this.uploadFileToS3(bucketName, fileKey, file)
        // const presignedUrl = await this.generateFilePresignedUrl(bucketName, fileKey)

        const newResume = await this.prisma.resume.create({
            data: {
                userId: userId,
                resumeName,
                awsFileKey: fileKey,
            },
        })
        return {
            response: newResume,
            statusCode: HttpStatus.OK,
        }
    }

    async getUserResumes(userId: string) {
        const bucketName: string = "aptly-be"

        const resumes = await this.prisma.resume.findMany({
            where: {
                userId,
            },
        })
        const transformedResumes = await Promise.all(
            resumes.map(async resume => {
                const fileUrl = resume.awsFileKey
                    ? await this.generateFilePresignedUrl(bucketName, resume.awsFileKey)
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
        await this.deleteFileFromS3("aptly-be", resume.awsFileKey as string)
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

    async uploadFileToS3(
        bucketName: string,
        fileKey: string,
        file: Express.Multer.File,
    ): Promise<void> {
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: fileKey,
                    Body: file.buffer,
                }),
            )
        } catch (error) {
            throw new InternalServerErrorException(`Failed to upload file to S3: ${error.message}`)
        }
    }

    async deleteFileFromS3(bucketName: string, fileKey: string): Promise<void> {
        try {
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: bucketName,
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
        bucketName: string,
        fileKey: string,
        expiresIn: number = 60 * 60 * 24, // 1 day
    ): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        })

        const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn })

        return presignedUrl
    }
}
