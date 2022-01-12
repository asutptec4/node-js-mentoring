import { Request, Response } from 'express';
import { mock, mockReset } from 'jest-mock-extended';

import { AuthController } from './auth-controller';
import { UserNotFoundException } from '../exceptions/user-service-exceptions';
import { User } from '../models';
import { AuthService } from '../services/auth-service';
import { UserService } from '../services/user-service';

describe('AuthController tests:', () => {
  const UserServiceMock = mock<UserService>();
  const AuthServiceMock = mock<AuthService>();
  const res = mock<Response>();
  let authController: AuthController;

  beforeEach(() => {
    res.status.mockReturnThis();
    authController = new AuthController(UserServiceMock, AuthServiceMock);
  });

  afterEach(() => {
    mockReset(UserServiceMock);
    mockReset(AuthServiceMock);
    mockReset(res);
  });

  describe('login', () => {
    const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const token = 'ABCDEF';
    const mockLoginInput = { login: 'login', password: 'password1' };
    test('call res.send and return user id and token', async () => {
      const req = mock<Request>({ body: mockLoginInput });
      UserServiceMock.findByLogin.mockResolvedValue({
        id,
        ...mockLoginInput,
      } as User);
      AuthServiceMock.getToken.mockReturnValue(token);
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ id, token });
    });
    test('return 400 error if user does not exist', async () => {
      const req = mock<Request>({ body: mockLoginInput });
      const err = new UserNotFoundException(mockLoginInput.login);
      UserServiceMock.findByLogin.mockRejectedValue(err);
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Login or password is not valid.',
      });
    });
    test('return 400 error if login is correct and password is wrong', async () => {
      const req = mock<Request>({ body: mockLoginInput });
      UserServiceMock.findByLogin.mockResolvedValue({
        id,
        login: 'login',
        password: 'userpassword12',
      } as User);
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Login or password is not valid.',
      });
    });
  });
});
