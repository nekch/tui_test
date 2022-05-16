import { ApiProperty } from '@nestjs/swagger';
import { Branch } from './branch.dto';

export class UserRepositoryOutput {
  @ApiProperty({ example: 'tui_test', description: 'Repository name' })
  name: string;

  @ApiProperty({ example: 'nekch', description: 'Repository owner username' })
  username: string;

  @ApiProperty({
    description: 'Array of repository branches',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          example: 'master',
          type: 'string',
        },
        commit: {
          example: 'sha',
          type: 'string'
        }
      }
    }
  })
  branches: Branch[];
}
