import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common"
import * as path from "path"

@Injectable()
export class ResumeValidationPipe implements PipeTransform {
    constructor(
        private readonly maxSize: number = 5 * 1024 * 1024, // 5MB by default
        private readonly allowedExtensions: string[] = ["pdf", "doc", "docx"],
    ) {}

    transform(value: Express.Multer.File) {
        const fileExtenstion = path.extname(value.originalname).toLocaleLowerCase().replace(".", "")

        if (!value) {
            throw new BadRequestException("No file provided")
        }
        if (!this.allowedExtensions.includes(fileExtenstion)) {
            throw new BadRequestException("File extension is not allowed")
        }
        if (value.size > this.maxSize) {
            throw new BadRequestException("File size exceedes 5mb limit")
        }

        return value
    }
}
