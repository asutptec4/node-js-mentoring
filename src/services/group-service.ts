import { Repository } from 'sequelize-typescript';
import { ValidationError } from 'sequelize';

import { Group, GroupModel } from '../models/group';
import { GroupServiceException } from './group-service-exception';


export class GroupService {
  private groupRepository: Repository<GroupModel>;

  constructor(groupRepository: Repository<GroupModel>) {
    this.groupRepository = groupRepository;
  }

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
    const found = await this.groupRepository.findByPk(id);
    if (found) {
      return new Group(found);
    }
    throw new GroupServiceException(`Group with ${id} doesn't exist`);
  }

  async getAll(): Promise<Group[]> {
    const groups = await this.groupRepository.findAll();
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
    throw new GroupServiceException(`User with ${group.id} doesn't exist`);
  }
}
