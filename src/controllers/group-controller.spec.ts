import { Request, Response } from 'express';
import { mock, mockReset } from 'jest-mock-extended';

import { GroupController } from './group-controller';
import {
  GroupAlreadyExistException,
  GroupNotExistException,
} from '../exceptions';
import { Group } from '../models';
import { GroupService } from '../services/group-service';
import { GroupValidator } from '../utils';

describe('GroupController tests:', () => {
  const GroupServiceMock = mock<GroupService>();
  const res = mock<Response>();
  let groupController: GroupController;

  beforeEach(() => {
    res.status.mockReturnThis();
    groupController = new GroupController(
      GroupServiceMock,
      new GroupValidator()
    );
  });

  afterEach(() => {
    mockReset(GroupServiceMock);
    mockReset(res);
  });

  describe('createGroup', () => {
    const mockGroupInput = {
      name: 'new group',
      permissions: ['READ', 'WRITE'],
    };
    test('call res.json with recently created group', async () => {
      const req = mock<Request>({ body: mockGroupInput });
      GroupServiceMock.add.mockResolvedValue(mockGroupInput as Group);
      await groupController.createGroup(req, res);
      expect(res.json).toHaveBeenCalledWith(mockGroupInput);
    });
    test('return 400 error if group already exist', async () => {
      const req = mock<Request>({ body: mockGroupInput });
      const err = new GroupAlreadyExistException(mockGroupInput.name);
      GroupServiceMock.add.mockRejectedValue(err);
      await groupController.createGroup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: err.message });
    });
  });

  describe('deleteGroup', () => {
    const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    test('call res.end with 204', async () => {
      const req = mock<Request>({ params: { id } });
      await groupController.deleteGroup(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
    test('return 404 error if group not exist', async () => {
      const req = mock<Request>({ params: { id } });
      const err = new GroupNotExistException(id);
      GroupServiceMock.delete.mockRejectedValue(err);
      await groupController.deleteGroup(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: err.message });
    });
  });

  describe('getAll', () => {
    const groupList = [
      {
        id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        name: 'new group',
        permissions: ['READ', 'WRITE'],
      } as Group,
    ];
    test('call res.json with list of group from the service', async () => {
      const req = mock<Request>();
      GroupServiceMock.getAll.mockResolvedValue(groupList);
      await groupController.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith(groupList);
    });
  });

  describe('getGroup', () => {
    const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const group = {
      id,
      name: 'new group',
      permissions: ['READ', 'WRITE'],
    } as Group;
    test('call res.json with found group', async () => {
      const req = mock<Request>({ params: { id } });
      GroupServiceMock.findById.mockResolvedValue(group);
      await groupController.getGroup(req, res);
      expect(res.json).toHaveBeenCalled();
    });
    test('return 404 error if group not exist', async () => {
      const req = mock<Request>({ params: { id } });
      const err = new GroupNotExistException(id);
      GroupServiceMock.findById.mockRejectedValue(err);
      await groupController.getGroup(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: err.message });
    });
  });

  describe('updateGroup', () => {
    const id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const mockGroupInput = {
      name: 'new group',
      permissions: ['READ', 'WRITE'],
    };
    const group = { id, ...mockGroupInput } as Group;
    test('call res.json with udpated group', async () => {
      const req = mock<Request>({ params: { id }, body: mockGroupInput });
      GroupServiceMock.findById.mockResolvedValue(group);
      await groupController.getGroup(req, res);
      expect(res.json).toHaveBeenCalled();
    });
    test('return 404 error if group not exist', async () => {
      const req = mock<Request>({ params: { id }, body: mockGroupInput });
      const err = new GroupNotExistException(id);
      GroupServiceMock.findById.mockRejectedValue(err);
      await groupController.getGroup(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: err.message });
    });
  });

  describe('validategroup', () => {
    test('call next if group input is valid', () => {
      const req = mock<Request>({
        body: { name: 'new group', permissions: ['READ', 'WRITE'] },
      });
      const next = jest.fn();
      groupController.validateGroup(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    test('call res.json with 400 if permissions field is not valid', () => {
      const req = mock<Request>({
        body: { name: 'new group', permissions: ['READ1', 'WRITE'] },
      });
      groupController.validateGroup(req, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });
    test('call res.json with 400 if name field is not valid', () => {
      const req = mock<Request>({
        body: { name: 'new', permissions: ['READ', 'WRITE'] },
      });
      groupController.validateGroup(req, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
