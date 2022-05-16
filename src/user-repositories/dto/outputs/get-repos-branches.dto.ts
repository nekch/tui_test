import { Branch } from './branch.dto';

interface FilteredRepos {
  name: string
}

export class GetReposBranchesOutput {
  filteredRepos: FilteredRepos[];
  branches: Branch[][];
}
