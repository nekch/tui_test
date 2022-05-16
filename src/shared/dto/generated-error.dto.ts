import { IsNotEmpty } from 'class-validator';

export class GeneratedErrorDto {
  @IsNotEmpty()
  status: number;

  @IsNotEmpty()
  message: string;
}
