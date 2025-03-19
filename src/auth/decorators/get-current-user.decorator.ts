/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const GetCurrentUser = createParamDecorator(
    (data: string | undefined, content: ExecutionContext) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const request = content.switchToHttp().getRequest()
        if (!data) return request.user

        return request.user[data]
    },
)
