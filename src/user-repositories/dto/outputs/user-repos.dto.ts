import { ApiProperty } from '@nestjs/swagger';

interface Branch {
  name: string;
  commit: string;
}

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
