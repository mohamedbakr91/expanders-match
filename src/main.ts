import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
process.on("uncaughtException", () => {
  process.exit(1);
});

process.on("unhandledRejection", () => {
  process.exit(1);
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Expanders")
    .setDescription("Expanders System REST API Documentation")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
      },

      "JWT",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api/docs", app, document, {
    jsonDocumentUrl: "docs/json",
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
