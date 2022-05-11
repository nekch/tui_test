import { Equals, IsDefined, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class AcceptHeaderDto {
  @IsString()
  @IsDefined()
  @Expose({ name: 'accept' })
  @Equals('application/json')
  accept: string;
}
