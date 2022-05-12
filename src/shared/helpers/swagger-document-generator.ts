import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';
import * as yaml from 'yaml';

export const swaggerDocument = (app: INestApplication): OpenAPIObject => {
  const options = new DocumentBuilder()
    .setTitle('Tui test')
    .setDescription('Open API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  fs.writeFileSync( 'swagger-spec.yml', yaml.stringify(document, {}));

  return document;
};
