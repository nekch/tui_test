import * as faker from 'faker';

import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoriesController } from '../user-repositories.controller';
import { UserRepositoriesService } from '../user-repositories.service';
import { OctokitModule } from '../octokit.module';
import { Mocks, ResponseMessages } from '../../constants';
import { HttpStatus } from '@nestjs/common';
import { UserRepositoryOutput } from '../dto/outputs';
import { UserRepositoriesInfo } from './mocks';

describe('TasksController', () => {
  let controller: UserRepositoriesController;
  let octokitModule: OctokitModule;

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

  describe('getUserRepos', () => {
    it('should return user repositories info', async () => {
    const result: UserRepositoryOutput[] = await controller.getUserRepos(
      { username: Mocks.USERNAME },
      { accept: Mocks.ACCEPT_HEADER }
    );

      expect(result[0].name).toEqual(UserRepositoriesInfo[0].name);
      expect(result[0].username).toEqual(UserRepositoriesInfo[0].username);
      expect(result[0].branches).toHaveLength(1);
    });

    it('should throw error due to username is invalid', async () => {
      const username = faker.random.alpha(10);

      const result: Promise<UserRepositoryOutput[]> = controller.getUserRepos(
        { username },
        { accept: Mocks.ACCEPT_HEADER }
      );

      await expect(result).rejects.toThrow(Error);
      await expect(result).rejects.toThrow(ResponseMessages.USER_NOT_FOUND);
      await expect(result).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });
  });
});
