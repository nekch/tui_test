import { Module } from '@nestjs/common';
import { UserRepositoriesModule } from './user-repositories/user-repositories.module';

@Module({
  imports: [UserRepositoriesModule]
})

export class AppModule {}
