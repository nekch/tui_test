import * as faker from 'faker';

import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoriesController } from '../user-repositories.controller';
import { UserRepositoriesService } from '../user-repositories.service';
import { OctokitModule } from '../octokit.module';
import { Mocks, ResponseMessages } from '../../constants';
import { HttpStatus } from '@nestjs/common';
import { UserRepositoryOutput } from '../dto/outputs';
import { UserRepositoriesInfo } from './mocks';

const dataMultiplier = (data) => {
  for (let i = 100; i > 0; i--) {
    const randomName = faker.random.alpha(20);
    data = [...data, { name: randomName, fork: false }];
  }

  return { data };
}

const { name: branchName, commitSha: sha } = UserRepositoriesInfo[0].branches[0];

const listForUser = jest.fn();
const getByUsername = jest.fn();
const listBranches = jest.fn().mockImplementation(() => ({ data: [{ name: branchName, commit: { sha } }] }));

jest.mock('@octokit/rest', () => {
  let Octokit = class MockOctokit {
    rest = {
      repos: {
        listForUser,
        listBranches
      }
    };

    users = {
      getByUsername,
    };
  };

  return { Octokit };
});

describe('TasksController', () => {
  let controller: UserRepositoriesController;
  let octokitModule: OctokitModule;

  beforeEach(async () => {
    jest.clearAllMocks();

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
      const repoName = UserRepositoriesInfo[0].name;
      getByUsername.mockImplementation(() => ({ data: { name: Mocks.USERNAME } }));
      listForUser.mockImplementationOnce(() => ({ data: [{ name: repoName, fork: false }] }));

      const result: UserRepositoryOutput[] = await controller.getUserRepos(
        { username: Mocks.USERNAME },
        { accept: Mocks.ACCEPT_HEADER }
      );

      expect(result[0].name).toEqual(UserRepositoriesInfo[0].name);
      expect(result[0].username).toEqual(UserRepositoriesInfo[0].username);
      expect(result[0].branches).toHaveLength(1);
    });

    it('should throw error due to username is invalid', async () => {
      getByUsername.mockRejectedValue({ message: ResponseMessages.USER_NOT_FOUND });
      const username = faker.random.alpha(10);

      const result: Promise<UserRepositoryOutput[]> = controller.getUserRepos(
        { username },
        { accept: Mocks.ACCEPT_HEADER }
      );

      await expect(result).rejects.toThrow(Error);
      await expect(result).rejects.toThrow(ResponseMessages.USER_NOT_FOUND);
      await expect(result).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });

    it('should throw error due to user don\'t have repos', async () => {
      getByUsername.mockImplementation(() => ({ data: { name: Mocks.USERNAME } }));
      listForUser.mockImplementation(() => ({ data: [] }));

      const result: Promise<UserRepositoryOutput[]> = controller.getUserRepos(
        { username: Mocks.USERNAME },
        { accept: Mocks.ACCEPT_HEADER }
      );

      await expect(result).rejects.toThrow(Error);
      await expect(result).rejects.toThrow(ResponseMessages.REPOSITORIES_NOT_FOUND);
      await expect(result).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });

    it('pagination check: should return 101 repo', async () => {
      const repoData = dataMultiplier([]);

      getByUsername.mockImplementation(() => ({ data: { name: Mocks.USERNAME } }));
      listForUser.mockImplementationOnce(() => repoData);
      listForUser.mockImplementationOnce(() => ({ data: [repoData.data[0]] }));

      const result: UserRepositoryOutput[] = await controller.getUserRepos(
        { username: Mocks.USERNAME },
        { accept: Mocks.ACCEPT_HEADER }
      );

      expect(result[0].name).toEqual(repoData.data[0].name);
      expect(result).toHaveLength(101);
    });
  });
});
