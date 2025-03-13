import { Body, Controller } from "@nestjs/common"
import { Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { User } from "src/users/entities/user.entity"

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/register")
    registerUser(@Body() user: User) {
        return this.authService.handleTestRegister(user.email, user.password)
    }
}
