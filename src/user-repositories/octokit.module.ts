import { Octokit } from '@octokit/rest';
import { Injectable } from '@nestjs/common';
import { config } from '../config'

@Injectable()
export class OctokitModule {
  public octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({ auth: config.gitApiKey });
  }
}
