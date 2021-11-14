import {
  AutoIncrement,
  Column,
  DataType,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

export type Permission = 'READ' | 'WRITE' | 'DETETE' | 'SHARE' | 'UPLOAD_FILES';

export class Group {
  public id: string;
  public name: string;
  public permissions: Permission[];

  constructor(groupModel: GroupModel) {
    this.id = groupModel.id;
    this.name = groupModel.name;
    this.permissions = groupModel.permissions as Permission[];
  }
}

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'groups',
})
export class GroupModel extends Model<Group, Omit<Group, 'id'>> {
  @PrimaryKey
  @IsUUID(4)
  @AutoIncrement
  @Column
  id!: string;

  @Unique(true)
  @Index
  @Column(DataType.STRING(255))
  name!: string;

  @Column(DataType.ARRAY(DataType.STRING(255)))
  permissions!: string[];
}
