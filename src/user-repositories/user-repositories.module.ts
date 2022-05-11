import { Module } from '@nestjs/common';
import { UserRepositoriesController } from './user-repositories.controller';
import { UserRepositoriesService } from './user-repositories.service';
import { OctokitModule } from './octokit.module';

@Module({
  controllers: [UserRepositoriesController],
  providers: [
    UserRepositoriesService,
    OctokitModule
  ]
})
export class UserRepositoriesModule {}
