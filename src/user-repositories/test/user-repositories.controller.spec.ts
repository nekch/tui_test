import * as faker from 'faker';

import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoriesController } from '../user-repositories.controller';
import { UserRepositoriesService } from '../user-repositories.service';
import { OctokitModule } from '../octokit.module';
import { ResponseMessages, Main } from '../../constants';
import { HttpStatus } from '@nestjs/common';
import { UserRepositoryOutput } from '../dto/outputs';

describe('TasksController', () => {
  let controller: UserRepositoriesController;
  let octokitModule: OctokitModule;

  let accept = 'application/json';
  let username = 'nekch';
  let page = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRepositoriesController],
      providers: [
        UserRepositoriesService,
        OctokitModule
      ]
    }).compile();

    controller = module.get<UserRepositoriesController>(UserRepositoriesController);
    octokitModule = module.get<OctokitModule>(OctokitModule);
  });

  it('should return user repositories info', async () => {
    const { data } = await octokitModule.octokit.rest.repos.listForUser({ username, per_page: Main.PER_PAGE, page });

    const result: UserRepositoryOutput[] = await controller.getUserRepos({ username }, { accept });

    expect(result).toHaveLength(data.length);
    expect(result[0].name).toEqual(data[0].name);
    expect(result[0].username).toEqual(data[0].owner.login);
    expect(result[0].branches).toHaveLength(1);
  });

  it('should throw error due to username is invalid', async () => {
    username = faker.random.alpha(10);

    const result: Promise<UserRepositoryOutput[]> = controller.getUserRepos({ username }, { accept });

    await expect(result).rejects.toThrow(Error);
    await expect(result).rejects.toThrow(ResponseMessages.USER_NOT_FOUND);
    await expect(result).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
  });
});
