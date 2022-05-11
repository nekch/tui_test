import { createParamDecorator, ExecutionContext, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { GenerateError } from '../shared/helpers';
import { ResponseMessages } from '../constants';

export const RequestHeaders = createParamDecorator(
  async (value:  any, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    const dto = plainToClass(value, headers, { excludeExtraneousValues: true });

    try {
      await validateOrReject(dto);

      return dto;
    } catch (err) {
      return GenerateError(ResponseMessages.INCORRECT_HEADER, HttpStatus.NOT_ACCEPTABLE);
    }
  }
);
