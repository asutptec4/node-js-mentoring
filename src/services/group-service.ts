import { Repository } from 'sequelize-typescript';
import { Op, ValidationError } from 'sequelize';

import { Group, GroupModel, UserModel } from '../models';
import { GroupServiceException } from './group-service-exception';

export class GroupService {
  constructor(
    private groupRepository: Repository<GroupModel>,
    private userRepository: Repository<UserModel>
  ) {}

  async add(group: Omit<Group, 'id'>): Promise<Group> {
    try {
      const newGroup = await this.groupRepository.create({
        name: group.name,
        permissions: group.permissions,
      });
      return new Group(newGroup);
    } catch (err) {
      if (err instanceof ValidationError && err.get('name')) {
        throw new GroupServiceException(`Group [${group.name}] already exist`);
      }
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    const found = await this.groupRepository.findByPk(id);
    if (found) {
      return found.destroy();
    } else {
      throw new GroupServiceException(`Group with ${id} doesn't exist`);
    }
  }

  async findById(id: string): Promise<Group> {
    const found = await this.groupRepository.findByPk(id, {
      include: [this.userRepository],
    });
    if (found) {
      return new Group(found);
    }
    throw new GroupServiceException(`Group with ${id} doesn't exist`);
  }

  async getAll(): Promise<Group[]> {
    const groups = await this.groupRepository.findAll({
      include: [this.userRepository],
    });
    return groups.map((g) => new Group(g));
  }

  async update(group: Group): Promise<Group> {
    const found = await this.groupRepository.findByPk(group.id);
    if (found) {
      found.name = group.name;
      found.permissions = group.permissions;
      const updatedGroup = await found.save();
      return new Group(updatedGroup);
    }
    throw new GroupServiceException(`Group with ${group.id} doesn't exist`);
  }

  async addUsersToGroup(groupId: string, userIds: string[]): Promise<void> {
    try {
      const sequelize = this.userRepository.sequelize;
      await sequelize?.transaction(async (t) => {
        const group = await this.groupRepository.findByPk(groupId, {
          transaction: t,
          include: [this.userRepository],
        });
        const users = await this.userRepository.findAll({
          where: {
            isDeleted: false,
            id: {
              [Op.in]: userIds,
            },
          },
          transaction: t,
        });
        if (group) {
          await group.$add('users', users, { transaction: t });
        } else {
          throw new GroupServiceException(`Cannot assign users to ${groupId}`);
        }
      });
    } catch (err) {
      throw err;
    }
  }
}
