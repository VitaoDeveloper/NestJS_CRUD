import { SwaggerModule } from "@nestjs/swagger";
import { SwaggerConfig } from "./swagger-config";
import { INestApplication } from "@nestjs/common";

export async function setupSwagger(app: INestApplication): Promise<void> {
    const document = SwaggerModule.createDocument(app, SwaggerConfig);
    SwaggerModule.setup('docs', app, document);
} 