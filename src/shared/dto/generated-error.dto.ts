import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GeneratedErrorDto {
  @ApiProperty({ example: 400 })
  @IsNotEmpty()
  status: number;

  @ApiProperty()
  @IsNotEmpty()
  message: string;
}
