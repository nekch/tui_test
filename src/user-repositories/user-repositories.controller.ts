import { Controller, Get, Query } from '@nestjs/common';
import { UserRepositoriesService } from './user-repositories.service';
import { GetUserReposInput } from './dto/inputs';
import { UserRepositoryOutput } from './dto/outputs';
import { RequestHeaders } from '../decorators';
import { AcceptHeaderDto, GeneratedErrorDto } from '../shared/dto';
import {
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('userRepositories')
@Controller('user-repositories')
export class UserRepositoriesController {
  constructor(private tasksService: UserRepositoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user repositories' })
  @ApiOkResponse({
    description: 'Returns user repositories info',
    type: [UserRepositoryOutput]
  })
  @ApiNotFoundResponse({
    description: 'User not found / Repository not found',
    type: GeneratedErrorDto
  })
  @ApiNotAcceptableResponse({
    description: `Accept header not equal: 'application/json'`,
    type: GeneratedErrorDto
  })
  getUserRepos(
    @Query() userInput: GetUserReposInput,
    @RequestHeaders(AcceptHeaderDto) headers: AcceptHeaderDto
  ): Promise<UserRepositoryOutput[]> {
    return this.tasksService.getUserRepos(userInput);
  }
}

