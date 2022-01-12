import { Request, Response } from 'express';
import { mock, mockReset } from 'jest-mock-extended';

import { UserController } from './user-controller';
import {
  UserAlreadyExistException,
  UserNotExistException,
} from '../exceptions/user-service-exceptions';
import { User } from '../models';
import { UserService } from '../services/user-service';
import { UserValidator } from '../utils';

describe('UserController tests:', () => {
  const UserServiceMock = mock<UserService>();
  const res = mock<Response>();
  let userController: UserController;

  beforeEach(() => {
    res.status.mockReturnThis();
    userController = new UserController(UserServiceMock, new UserValidator());
  });

  afterEach(() => {
    mockReset(UserServiceMock);
    mockReset(res);
  });

  describe('createUser', () => {
    const mockUserInput = { login: 'login', password: 'password', age: 20 };
    test('call res.json with recently created user', async () => {
      const req = mock<Request>({ body: mockUserInput });
      UserServiceMock.add.mockResolvedValue(mockUserInput as User);
      await userController.createUser(req, res);
      expect(res.json).toHaveBeenCalledWith(mockUserInput);
    });
    test('return 400 error if user already exist', async () => {
      const req = mock<Request>({ body: mockUserInput });
      const err = new UserAlreadyExistException(mockUserInput.login);
      UserServiceMock.add.mockRejectedValue(err);
      await userController.createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: err.message });
    });
  });

  describe('deleteUser', () => {
    const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    test('call res.end with 204', async () => {
      const req = mock<Request>({ params: { id } });
      UserServiceMock.delete.mockResolvedValue({} as User);
      await userController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
    test('return 404 error if user not exist', async () => {
      const req = mock<Request>({ params: { id } });
      const err = new UserNotExistException(id);
      UserServiceMock.delete.mockRejectedValue(err);
      await userController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: err.message });
    });
  });

  describe('getAll', () => {
    const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const mockUserInput = { login: 'login', password: 'password1', age: 20 };
    const userList = [{ id, ...mockUserInput }];
    test('call res.json with list of user from the service', async () => {
      const req = mock<Request>();
      UserServiceMock.getAll.mockResolvedValue(userList);
      await userController.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith(userList);
    });
  });

  describe('getAutoSuggestUsers', () => {
    const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const userList = [{ id, login: 'login', password: 'password1', age: 20 }];
    test('call res.json with list of user if limit and loginSubstring are provided', async () => {
      const req = mock<Request>({
        query: { limit: '10', loginSubstring: 'admin' },
      });
      UserServiceMock.getSuggestedUsers.mockResolvedValue(userList);
      await userController.getAutoSuggestUsers(req, res);
      expect(res.json).toHaveBeenCalledWith(userList);
    });
    test('return 400 error if limit is not provided', async () => {
      const req = mock<Request>();
      req.query = { loginSubstring: 'admin' };
      await userController.getAutoSuggestUsers(req, res);
      expect(UserServiceMock.getSuggestedUsers).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Bad query params' });
    });
    test('return 400 error if loginSubstring is not provided', async () => {
      const req = mock<Request>();
      req.query = { llimit: '10' };
      await userController.getAutoSuggestUsers(req, res);
      expect(UserServiceMock.getSuggestedUsers).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Bad query params' });
    });
  });

  describe('getUser', () => {
    const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const user = { id, login: 'login', password: 'password1', age: 20 };
    test('call res.json with found user', async () => {
      const req = mock<Request>({ params: { id } });
      UserServiceMock.findById.mockResolvedValue(user);
      await userController.getUser(req, res);
      expect(res.json).toHaveBeenCalled();
    });
    test('return 404 error if user not exist', async () => {
      const req = mock<Request>({ params: { id } });
      const err = new UserNotExistException(id);
      UserServiceMock.findById.mockRejectedValue(err);
      await userController.getUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: err.message });
    });
  });

  describe('updateUser', () => {
    const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const mockUserInput = { login: 'login', password: 'password1', age: 20 };
    const user = { id, ...mockUserInput };
    test('call res.json with udpated user', async () => {
      const req = mock<Request>({ params: { id }, body: mockUserInput });
      UserServiceMock.findById.mockResolvedValue(user);
      await userController.getUser(req, res);
      expect(res.json).toHaveBeenCalled();
    });
    test('return 404 error if user not exist', async () => {
      const req = mock<Request>({ params: { id }, body: mockUserInput });
      const err = new UserNotExistException(id);
      UserServiceMock.findById.mockRejectedValue(err);
      await userController.getUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: err.message });
    });
  });

  describe('validateUser', () => {
    test('call next if user input is valid', () => {
      const req = mock<Request>({
        body: { login: 'login', password: 'password1', age: 20 },
      });
      const next = jest.fn();
      userController.validateUser(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    test('call res.json with 400 if user input is not valid', () => {
      const req = mock<Request>({
        body: { login: 'log', password: 'password1', age: 20 },
      });
      userController.validateUser(req, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
