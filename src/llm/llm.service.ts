import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import OpenAI from "openai"

@Injectable()
export class LlmService {
    private openAI: OpenAI
    constructor(private configService: ConfigService) {
        this.openAI = new OpenAI({
            apiKey: this.configService.get<string>("llm.openAIApiKey"),
        })
    }

    async parseRawData(rawData: string) {
        const response = await this.openAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "developer",
                    content: "Return the raw data in a json format",
                },
                {
                    role: "user",
                    content: rawData,
                },
            ],
        })

        console.log(response)
        console.log(response.choices[0].message.content)
    }
}
