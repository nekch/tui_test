import { INestApplication } from '@nestjs/common';
import swaggerUi = require('swagger-ui-express');
import YAML = require('yamljs');

export const swaggerSetup = (app: INestApplication) => app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(YAML.load('./swagger-spec.yml'))
);
