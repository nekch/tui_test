import { HttpException } from '@nestjs/common';
import { GeneratedErrorDto } from '../dto';

export const GenerateError = ({ message, status: code = 400 }: GeneratedErrorDto): Error => {
  return new HttpException({ status: code, message }, code);
};
