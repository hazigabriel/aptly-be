import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import OpenAI from "openai"

@Injectable()
export class LlmService {
    private openAI: OpenAI
    private parsePrompt: string | undefined
    constructor(private configService: ConfigService) {
        this.openAI = new OpenAI({
            apiKey: this.configService.get<string>("llm.openAIApiKey"),
        })
        this.parsePrompt = this.configService.get<string>("llm.openAIParseTextPrompt")
    }

    async parseRawData(rawData: string) {
        if (!this.parsePrompt) {
            throw new InternalServerErrorException(
                "OPENAI_PARSE_TEXT_PROMPT env variable not loaded",
            )
        }

        const response = await this.openAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "developer",
                    content: this.parsePrompt,
                },
                {
                    role: "user",
                    content: rawData,
                },
            ],
        })
        const parsedContent = response.choices[0].message.content
        if (!parsedContent) {
            throw new InternalServerErrorException("Failed to parse resume text")
        }
        return parsedContent
    }
}
