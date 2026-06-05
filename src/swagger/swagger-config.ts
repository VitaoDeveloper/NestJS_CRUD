import { DocumentBuilder, OpenAPIObject, SwaggerCustomOptions } from "@nestjs/swagger";

export const SwaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('An API Service for library management')
    .setVersion('2.0')
    .build();

export const SwaggerOptions: SwaggerCustomOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js',
  ],
}