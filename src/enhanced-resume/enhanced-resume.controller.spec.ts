import { Test, TestingModule } from "@nestjs/testing"
import { EnhancedResumeController } from "./enhanced-resume.controller"

describe("EnhancedResumeController", () => {
    let controller: EnhancedResumeController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EnhancedResumeController],
        }).compile()

        controller = module.get<EnhancedResumeController>(EnhancedResumeController)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })
})
