import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepositoryOutput, GetReposOutput, GetReposBranchesOutput } from './dto/outputs';
import { GetUserReposInput } from './dto/inputs';
import { OctokitModule } from './octokit.module';
import { GenerateError } from '../shared/helpers';
import { ResponseMessages, Main } from '../constants';

@Injectable()
export class UserRepositoriesService {
  constructor(private octokitService: OctokitModule) {}

  private async checkUser(username: string): Promise<void> {
    try {
      await this.octokitService.octokit.users.getByUsername({ username });
    } catch (err) {
      throw GenerateError({
        message: ResponseMessages.USER_NOT_FOUND,
        status: HttpStatus.NOT_FOUND
      });
    }
  }

  private async getRepos(username: string, repositories = [], page = 1): Promise<GetReposOutput[]> {
    const { data } = await this.octokitService.octokit.rest.repos.listForUser({ username, per_page: Main.PER_PAGE, page });
    page++;
    repositories.push(...data);

    if (data.length === Main.PER_PAGE) {
      return this.getRepos(username, repositories, page);
    }

    return repositories;
  }

  private async getReposBranches(repositories: GetReposOutput[], username: string): Promise<GetReposBranchesOutput> {
    const branchesPromises = [];

    const filteredRepos = repositories.map((repo) => {
      if (repo.fork) {
        return null;
      }

      const branchPromise = this.octokitService.octokit.rest.repos.listBranches({
        owner: username,
        repo: repo.name,
      });

      branchesPromises.push(branchPromise);

      return { name: repo.name };
    }).filter(Boolean);

    const branchesData = await Promise.all(branchesPromises);

    const branches = branchesData.map((branchData) => {
      const { data } = branchData;

      return data.map((branch) => ({ name: branch.name, commitSha: branch.commit.sha }));
    });

    return { filteredRepos, branches };
  }

  async getUserRepos(userInput: GetUserReposInput): Promise<UserRepositoryOutput[]> {
    const { username } = userInput;

    await this.checkUser(username);

    const repositories: GetReposOutput[] = await this.getRepos(username);

    if (!repositories.length) {
      throw GenerateError({
        message: ResponseMessages.REPOSITORIES_NOT_FOUND,
        status: HttpStatus.NOT_FOUND
      });
    }

    const { filteredRepos, branches } = await this.getReposBranches(repositories, username);

    const result = filteredRepos.map((repo, index) =>
      ({ name: repo.name, username, branches: branches[index] })
    );

    return result;
  }
}
