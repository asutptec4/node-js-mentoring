import {
  Model,
  Table,
  Column,
  PrimaryKey,
  Default,
  Unique,
  DataType,
  Index,
  IsUUID,
  AutoIncrement,
} from 'sequelize-typescript';

export class User {
  public id: string;
  public login: string;
  public password: string;
  public age: number;

  constructor(userModel: UserModel) {
    this.id = userModel.id;
    this.login = userModel.login;
    this.password = userModel.password;
    this.age = userModel.age;
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
  @Column(DataType.STRING(254))
  login!: string;

  @Column(DataType.STRING(254))
  password!: string;

  @Column(DataType.INTEGER)
  age!: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isDeleted!: boolean;
}
