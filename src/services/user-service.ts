import { Repository } from 'sequelize-typescript';
import { Op, ValidationError } from 'sequelize';

import { User, UserModel } from '../models/user';
import { UserServiceException } from './user-service-exception';

export class UserService {
  private userRepository: Repository<UserModel>;

  constructor(userRepository: Repository<UserModel>) {
    this.userRepository = userRepository;
  }

  async add(user: Omit<User, 'id' | 'isDeleted'>): Promise<User> {
    try {
      const newUser = await this.userRepository.create({
        login: user.login,
        password: user.password,
        age: user.age,
      });
      return new User(newUser);
    } catch (err) {
      if (err instanceof ValidationError && err.get('login')) {
        throw new UserServiceException(`User [${user.login}] already exist`);
      }
      throw err;
    }
  }

  async delete(id: string): Promise<User> {
    const found = await this.userRepository.findByPk(id);
    if (found) {
      found.isDeleted = true;
      return found.save();
    } else {
      throw new UserServiceException(`User with ${id} doesn't exist`);
    }
  }

  async findById(id: string): Promise<User> {
    const found = await this.userRepository.findByPk(id);
    if (found) {
      return new User(found);
    }
    throw new UserServiceException(`User with ${id} doesn't exist`);
  }

  async getAll(): Promise<User[]> {
    const users = await this.userRepository.findAll({
      where: { isDeleted: false },
    });
    return users.map((u) => new User(u));
  }

  async getSuggestedUsers(
    loginSubstring: string,
    limit: number
  ): Promise<User[]> {
    const users = await this.userRepository.findAll({
      where: {
        isDeleted: false,
        login: {
          [Op.like]: `%${loginSubstring}%`,
        },
      },
      limit,
      order: [['login', 'ASC']],
    });
    return users.map((u) => new User(u));
  }

  async update(user: Omit<User, 'isDeleted'>): Promise<User> {
    const found = await this.userRepository.findByPk(user.id);
    if (found) {
      found.login = user.login;
      found.password = user.password;
      found.age = user.age;
      const updatedUser = await found.save();
      return new User(updatedUser);
    }
    throw new UserServiceException(`User with ${user.id} doesn't exist`);
  }
}
