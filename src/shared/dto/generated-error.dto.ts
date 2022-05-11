import { ApiProperty } from '@nestjs/swagger';

export class GeneratedErrorDto {
  @ApiProperty({ example: 400 })
  status: number;

  @ApiProperty()
  message: string;
}
