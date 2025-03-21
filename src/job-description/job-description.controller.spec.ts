import { Test, TestingModule } from "@nestjs/testing"
import { JobDescriptionController } from "./job-description.controller"

describe("JobDescriptionController", () => {
    let controller: JobDescriptionController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobDescriptionController],
        }).compile()

        controller = module.get<JobDescriptionController>(JobDescriptionController)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })
})
