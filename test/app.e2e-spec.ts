import * as request from 'supertest';
import * as faker from 'faker';
import * as nock from 'nock';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UserRepositories, Mocks, ResponseMessages } from '../src/constants';
import { UserRepositoriesInfo } from '../src/user-repositories/test/mocks';

describe('e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/user-repositories (GET)', () => {
    const incorrectHeader = 'text/plain';
    const repoName = UserRepositoriesInfo[0].name;
    const { name: branchName, commitSha: sha } = UserRepositoriesInfo[0].branches[0];

    nock(Mocks.GIT_BASE_URL)
      .get('/users/nekch')
      .reply(200, { body: UserRepositoriesInfo })
      .get('/users/nekch/repos')
      .query({ per_page: UserRepositories.PER_PAGE, page: 1 })
      .reply(200, [{ name: repoName, fork: false }])
      .get('/repos/nekch/tui_test/branches')
      .reply(200, [{ name: branchName, commit: { sha } }]);

    it('should return user repositories info', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/user-repositories')
        .accept(Mocks.ACCEPT_HEADER)
        .query({ username: Mocks.USERNAME })
        .expect(HttpStatus.OK);

      expect(body).toEqual(UserRepositoriesInfo);
    });

    it('should return error due to no header', () => {
      return request(app.getHttpServer())
        .get('/user-repositories')
        .expect({ status: HttpStatus.NOT_ACCEPTABLE, message: ResponseMessages.INCORRECT_HEADER });
    });

    it('should return error due to header is not correct', () => {
      return request(app.getHttpServer())
        .get('/user-repositories')
        .accept(incorrectHeader)
        .expect({ status: HttpStatus.NOT_ACCEPTABLE, message: ResponseMessages.INCORRECT_HEADER });
    });

    it('should return error due to user don\'t send', () => {
      nock(Mocks.GIT_BASE_URL)
        .get('/users/')
        .reply(404, { message: ResponseMessages.USER_NOT_FOUND })

      return request(app.getHttpServer())
        .get('/user-repositories')
        .accept(Mocks.ACCEPT_HEADER)
        .expect({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.USER_NOT_FOUND });
    });

    it('should return error due to username is\t exist', () => {
      const username = faker.random.alpha(10);

      nock(Mocks.GIT_BASE_URL)
        .get(`/users/${username}`)
        .reply(404, { message: ResponseMessages.USER_NOT_FOUND });

      return request(app.getHttpServer())
        .get('/user-repositories')
        .accept(Mocks.ACCEPT_HEADER)
        .query({ username })
        .expect({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.USER_NOT_FOUND });
    });
  });

  afterAll(async () => {
    nock.cleanAll();

    await app.close();
  });
});
