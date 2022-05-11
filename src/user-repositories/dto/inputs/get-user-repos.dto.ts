import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserReposInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;
}
