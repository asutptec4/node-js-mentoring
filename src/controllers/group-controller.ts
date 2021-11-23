import { NextFunction, Request, Response } from 'express';

import { GroupService } from '../services/group-service';
import { GroupValidator } from '../utils/group-validator';

export class GroupController {
  private groupService: GroupService;
  private groupValidator: GroupValidator;

  constructor(service: GroupService, validator: GroupValidator) {
    this.groupService = service;
    this.groupValidator = validator;
  }

  async createGroup(req: Request, res: Response): Promise<void> {
    try {
      const { name, permissions } = req.body;
      const user = await this.groupService.add({ name, permissions });
      res.json(user);
    } catch (err: unknown) {
      this.sendError(res, 400, (err as Error).message);
    }
  }

  async deleteGroup(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.groupService.delete(id);
      res.status(204).end();
    } catch (e: unknown) {
      this.handleGroupServiceError(e, res);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    res.json(await this.groupService.getAll());
  }

  async getGroup(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.groupService.findById(id);
      res.json(user);
    } catch (e: unknown) {
      this.handleGroupServiceError(e, res);
    }
  }

  async updateGroup(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, permissions } = req.body;
      const user = await this.groupService.update({
        id,
        name,
        permissions,
      });
      res.json(user);
    } catch (e: unknown) {
      this.handleGroupServiceError(e, res);
    }
  }

  private handleGroupServiceError(error: unknown, res: Response): void {
    if (error instanceof Error) {
      this.sendError(res, 404, error.message);
    }
  }

  private sendError(res: Response, code: number, message: string): void {
    res.status(code).json({ error: message });
  }

  validateGroup(req: Request, res: Response, next: NextFunction): void {
    const isValid = this.groupValidator.validate(req.body);
    if (isValid) {
      next();
    } else {
      this.sendError(res, 400, this.groupValidator.getValidationMessage());
    }
  }

  async assignUsers(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { users } = req.body;
      if (id && Array.isArray(users)) {
        await this.groupService.addUsersToGroup(id, users);
        res.status(200).end();
      } else {
        this.sendError(res, 400, 'Bad request params');
      }
    } catch (e: unknown) {
      this.handleGroupServiceError(e, res);
    }
  }
}
