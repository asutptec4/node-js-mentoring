import { Router } from 'express';

import { GroupController } from '../controllers/group-controller';

export class GroupRouter {
  public instance: Router;

  constructor(groupController: GroupController) {
    this.instance = Router();
    this.instance
      .get('/', groupController.getAll.bind(groupController))
      .get('/:id', groupController.getGroup.bind(groupController))
      .put('/:id', [
        groupController.validateGroup.bind(groupController),
        groupController.updateGroup.bind(groupController),
      ])
      .post('/', [
        groupController.validateGroup.bind(groupController),
        groupController.createGroup.bind(groupController),
      ])
      .delete('/:id', groupController.deleteGroup.bind(groupController));
  }
}
