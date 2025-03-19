import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const config = new DocumentBuilder()
        .setTitle("Aptly")
        .setVersion("1.0")
        .addBearerAuth(undefined, "jwt")
        .addSecurityRequirements("jwt")
        .build()

    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("api", app, documentFactory)

    app.useGlobalPipes(new ValidationPipe())
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
