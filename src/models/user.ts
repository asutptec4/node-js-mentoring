import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import { Group, GroupModel, UserGroupModel } from '.';

export class User {
  public id: string;
  public login: string;
  public password: string;
  public age: number;
  public groups?: Group[];

  constructor(userModel: UserModel) {
    this.id = userModel.id;
    this.login = userModel.login;
    this.password = userModel.password;
    this.age = userModel.age;
    this.groups = userModel.groups?.map((g) => new Group(g));
  }
}

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'users',
})
export class UserModel extends Model<
  User & {
    isDeleted: boolean;
    group: GroupModel[];
  },
  Omit<User, 'id'>
> {
  @PrimaryKey
  @IsUUID(4)
  @AutoIncrement
  @Column
  id!: string;

  @Unique(true)
  @Index
  @Column(DataType.STRING(255))
  login!: string;

  @Column(DataType.STRING(255))
  password!: string;

  @Column(DataType.INTEGER)
  age!: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isDeleted!: boolean;

  @BelongsToMany(() => GroupModel, () => UserGroupModel)
  groups!: GroupModel[];
}
