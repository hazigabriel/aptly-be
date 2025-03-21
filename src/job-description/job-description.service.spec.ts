import { Test, TestingModule } from "@nestjs/testing"
import { JobDescriptionService } from "./job-description.service"

describe("JobDescriptionService", () => {
    let service: JobDescriptionService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JobDescriptionService],
        }).compile()

        service = module.get<JobDescriptionService>(JobDescriptionService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
