import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "src/users/entities/user.entity"
import { Repository } from "typeorm"

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    handleRegister(email: string, password: string) {
        console.log(email, password)
    }

    handleTestRegister(email: string, password: string) {
        const user = this.repo.create({ email, password })

        return this.repo.save(user)
    }
}
