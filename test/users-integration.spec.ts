import axios from 'axios';
import express, { Application } from 'express';
import { Server } from 'http';
import { mock, mockReset } from 'jest-mock-extended';
import { Repository } from 'sequelize-typescript';

import { UserController } from '../src/controllers/user-controller';
import { LoggerInterface } from '../src/logger/logger';
import { createErrorHandlerMiddleware } from '../src/middlewares/error-handler';
import { GroupModel, UserModel } from '../src/models';
import { UserRouter } from '../src/routes/user-router';
import { UserService } from '../src/services/user-service';
import { UserValidator } from '../src/utils/user-validator';

jest.mock('../src/logger/logger'); // to prevent logging into console during test running

type AxiosError = Error & { response: { status: number; data: unknown } };
const usersRoute = '/api/users';
const testPort = 3000;
const usersApiPath = `http://localhost:${testPort}${usersRoute}`;

describe('Users API tests:', () => {
  const GroupRepositoryMock = mock<Repository<GroupModel>>();
  const UserRepositoryMock = mock<Repository<UserModel>>();
  let server: Server;

  beforeAll(() => {
    const app: Application = express();
    app.use(express.json());
    const userController: UserController = new UserController(
      new UserService(UserRepositoryMock, GroupRepositoryMock),
      new UserValidator()
    );
    app.use(usersRoute, new UserRouter(userController).instance);
    app.use(createErrorHandlerMiddleware(mock<LoggerInterface>()));
    server = app.listen(testPort);
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    mockReset(GroupRepositoryMock);
    mockReset(UserRepositoryMock);
  });

  describe('createUser', () => {
    test('return recently created user with 200 response code', async () => {
      const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
      const mockUserInput = { login: 'login', password: 'password12', age: 20 };
      UserRepositoryMock.create.mockResolvedValue({
        id,
        ...mockUserInput,
      } as UserModel);
      const res = await axios.post(usersApiPath, mockUserInput);
      expect(res.status).toEqual(200);
      expect(res.data).toEqual({ id, ...mockUserInput });
    });

    test('return 400 response code if password field is not valid', async () => {
      const mockUserInput = { login: 'login', password: 'password', age: 20 };
      try {
        await axios.post(usersApiPath, mockUserInput);
      } catch (e) {
        expect((e as AxiosError).response.status).toEqual(400);
      }
    });
  });

  describe('getAll', () => {
    test('return list with users with 200 response code', async () => {
      const userList = [
        {
          id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          login: 'admin',
          password: 'password123',
          age: 20,
        },
      ] as UserModel[];
      UserRepositoryMock.findAll.mockResolvedValue(userList);
      const res = await axios.get(usersApiPath);
      expect(res.status).toEqual(200);
      expect(res.data).toEqual(userList);
    });

    test('return 500 if sequilize return unexpected error', async () => {
      UserRepositoryMock.findAll.mockRejectedValue(new Error('some error'));
      try {
        await axios.get(usersApiPath);
      } catch (e) {
        const response = (e as AxiosError).response;
        expect(response.status).toEqual(500);
        expect(response.data).toEqual({
          error: 'Internal Service Error',
        });
      }
    });
  });
});
