import { v4 as uuidv4 } from 'uuid';

import { User } from '../models/user';
import { UserNotFoundException } from './user-not-found';

export class UserService {
  private users: User[] = [];

  add(user: Omit<User, 'id' | 'isDeleted'>): User {
    const newUser: User = {
      id: uuidv4(),
      login: user.login,
      password: user.password,
      age: user.age,
      isDeleted: false,
    };
    this.users.push(newUser);
    return newUser;
  }

  delete(id: string): User {
    const found = this.users.find((u) => u.id === id);
    if (found && this.isNotDeleted(found)) {
      found.isDeleted = true;
      return found;
    }
    throw new UserNotFoundException(`User with ${id} doesn't exist`);
  }

  findById(id: string): User {
    const found = this.users.find((u) => u.id === id);
    if (found && this.isNotDeleted(found)) {
      return found;
    }
    throw new UserNotFoundException(`User with ${id} doesn't exist`);
  }

  getAll(): User[] {
    return this.users.filter((u) => this.isNotDeleted(u));
  }

  getAutoSuggestUsers(loginSubstring: string, limit: number): User[] {
    return this.users
      .filter((u) => u.login.includes(loginSubstring))
      .sort((a, b) => a.login.localeCompare(b.login))
      .slice(0, limit);
  }

  update(user: Omit<User, 'isDeleted'>): User {
    const found = this.users.find((u) => u.id === user.id);
    if (found && this.isNotDeleted(found)) {
      found.login = user.login;
      found.password = user.password;
      found.age = user.age;
      return found;
    }
    throw new UserNotFoundException(`User with ${user.id} doesn't exist`);
  }

  private isNotDeleted(user: User): boolean {
    return !user.isDeleted;
  }
}
