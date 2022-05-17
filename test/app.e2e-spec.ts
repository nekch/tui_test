import * as request from 'supertest';
import * as faker from 'faker';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Mocks, ResponseMessages } from '../src/constants';
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
    it('should return user repositories info', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/user-repositories')
        .accept(Mocks.ACCEPT_HEADER)
        .query({ username: Mocks.USERNAME })
        .expect(HttpStatus.OK);

      expect(body[0]).toEqual(UserRepositoriesInfo[0]);
    });

    it('should return error due to no header', () => {
      return request(app.getHttpServer())
        .get('/user-repositories')
        .expect({ status: HttpStatus.NOT_ACCEPTABLE, message: ResponseMessages.INCORRECT_HEADER });
    });

    it('should return error due to user don\'t send', () => {
      return request(app.getHttpServer())
        .get('/user-repositories')
        .accept(Mocks.ACCEPT_HEADER)
        .expect({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.USER_NOT_FOUND });
    });

    it('should return error due to username is\t exist', () => {
      const username = faker.random.alpha(10);

      return request(app.getHttpServer())
        .get('/user-repositories')
        .accept(Mocks.ACCEPT_HEADER)
        .query({ username })
        .expect({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.USER_NOT_FOUND });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
