import { Column, ForeignKey, IsUUID, Model, Table } from 'sequelize-typescript';

import { GroupModel, UserModel } from '.';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'users_groups',
})
export class UserGroupModel extends Model {
  @ForeignKey(() => UserModel)
  @IsUUID(4)
  @Column
  userId!: string;

  @ForeignKey(() => GroupModel)
  @IsUUID(4)
  @Column
  groupId!: string;
}
