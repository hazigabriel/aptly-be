import { Test, TestingModule } from "@nestjs/testing"
import { EnhancedResumeService } from "./enhanced-resume.service"

describe("EnhancedResumeService", () => {
    let service: EnhancedResumeService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EnhancedResumeService],
        }).compile()

        service = module.get<EnhancedResumeService>(EnhancedResumeService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
