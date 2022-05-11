import { HttpException } from '@nestjs/common';
import { GeneratedErrorDto } from '../dto';

export const GenerateError = (message: string, code = 400): GeneratedErrorDto => {
  throw new HttpException({ status: code, message }, code);
}
