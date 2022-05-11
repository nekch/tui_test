import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepositoryOutput } from './dto/outputs';
import { GetUserReposInput } from './dto/inputs';
import { OctokitModule } from './octokit.module';
import { GetReposOutput } from './dto/outputs';
import { GenerateError } from '../shared/helpers';
import { ResponseMessages, Main } from '../constants';

@Injectable()
export class UserRepositoriesService {
  constructor(private octokitService: OctokitModule) {}

  private async getRepos(username: string, repositories = [], page = 1): Promise<GetReposOutput[]> {
    const { data } = await this.octokitService.octokit.rest.repos.listForUser({ username, per_page: Main.PER_PAGE, page });
    page++;
    repositories.push(...data);

    if (data.length === Main.PER_PAGE) {
      return this.getRepos(username, repositories, page);
    }

    return repositories;
  }

  async getUserRepos(userInput: GetUserReposInput): Promise<UserRepositoryOutput[]> {
    const { username } = userInput;

    try {
      await this.octokitService.octokit.users.getContextForUser({ username });
    } catch (err) {
      GenerateError(ResponseMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const repositories: GetReposOutput[] = await this.getRepos(username);

    if (!repositories.length) {
      GenerateError(ResponseMessages.REPOSITORIES_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const branchesPromises = [];

    const filteredRepos = repositories.map((repo) => {
      if (repo.fork) {
        return;
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

    const result = filteredRepos.map((repo, index) =>
      ({ name: repo.name, username, branches: branches[index] })
    );

    return result;
  }
}
