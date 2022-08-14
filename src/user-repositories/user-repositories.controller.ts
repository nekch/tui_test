import { Controller, Get, Query } from '@nestjs/common';
import { UserRepositoriesService } from './user-repositories.service';
import { GetUserReposInput } from './dto/inputs';
import { UserRepositoryOutput } from './dto/outputs';
import { RequestHeaders } from '../shared/validators';
import { AcceptHeaderDto } from '../shared/dto';

@Controller('user-repositories')
export class UserRepositoriesController {
  constructor(private tasksService: UserRepositoriesService) {}

  @Get()
  getUserRepos(
    @Query() userInput: GetUserReposInput,
    @RequestHeaders(AcceptHeaderDto) headers: AcceptHeaderDto
  ): Promise<UserRepositoryOutput[]> {
    return this.tasksService.getUserRepos(userInput);
  }
}
