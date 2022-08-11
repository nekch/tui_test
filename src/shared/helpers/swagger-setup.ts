import { INestApplication } from '@nestjs/common';
import swaggerUi = require('swagger-ui-express');
import * as yaml from 'js-yaml';
import * as fs from 'fs';

export const swaggerSetup = (app: INestApplication) => app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(yaml.load(fs.readFileSync('./swagger-spec.yml', 'utf8')))
);
