import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import OpenAI from "openai"

import { COVER_LETTER_PROMPT, RESUME_PARSE_PROMPT } from "src/constants"
@Injectable()
export class LlmService {
    private openAI: OpenAI
    constructor(private configService: ConfigService) {
        this.openAI = new OpenAI({
            apiKey: this.configService.get<string>("llm.openAIApiKey"),
        })
    }

    async parseRawData(rawData: string): Promise<string> {
        const response = await this.getOpenAIResponse(RESUME_PARSE_PROMPT, rawData)

        return response
    }

    async generateCoverLetter(resumeData, jobDescriptionData): Promise<string> {
        const rawData = JSON.stringify({
            resume: resumeData,
            jobDescription: jobDescriptionData,
        })
        const response = await this.getOpenAIResponse(COVER_LETTER_PROMPT, rawData)

        return response
    }

    async getOpenAIResponse(prompt: string, data: string): Promise<string> {
        const response = await this.openAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "developer",
                    content: prompt,
                },
                {
                    role: "user",
                    content: data,
                },
            ],
        })
        const responseContent = response.choices[0].message.content

        if (!responseContent) {
            throw new InternalServerErrorException("Failed to retrieve response from OpenAI.")
        }

        return responseContent
    }
}
