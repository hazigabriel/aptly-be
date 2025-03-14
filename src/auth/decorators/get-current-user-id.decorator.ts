import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const GetCurrentUserId = createParamDecorator((_, content: ExecutionContext): string => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = content.switchToHttp().getRequest()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return request.user.sub
})
