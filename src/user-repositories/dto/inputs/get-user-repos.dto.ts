import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserReposInput {
  @IsNotEmpty()
  @IsString()
  username: string;
}
