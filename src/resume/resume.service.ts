import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { BadGatewayException, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
@Injectable()
export class ResumeService {
    constructor(
        @Inject("S3_CLIENT")
        private readonly s3Client = new S3Client({
            region: process.env.AWS_S3_REGION,
        }),
    ) {}

    async createResumeWithFile(userId: string, file: Express.Multer.File) {
        const bucketName = "aptly-be"
        const fileKey = `resumes/${new Date().getTime()}[*]${file.originalname}`

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: fileKey,
                Body: file.buffer,
            }),
        )
        const presignedUrl = await this.generateFilePresignedUrl(bucketName, fileKey)
        console.log(presignedUrl)
        return new HttpException("Successfully uploaded resume", HttpStatus.OK)
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
