import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import * as cookieParser from "cookie-parser"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type, Authorization",
        credentials: true,
    })
    app.use(cookieParser())

    const config = new DocumentBuilder()
        .setTitle("Aptly")
        .setVersion("1.0")
        .addBearerAuth(undefined, "jwt")
        .addSecurityRequirements("jwt")
        .build()

    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("api", app, documentFactory)

    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
