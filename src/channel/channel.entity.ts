import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table
export class Channel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV1)
  @Column(DataType.UUID)
  public id: string;

  @Column(DataType.ARRAY(DataType.UUID))
  public participants: string[];

  @Column(DataType.ARRAY(DataType.UUID))
  public admins: string[];

  @Column(DataType.STRING)
  public description: string;

  @Column(DataType.ARRAY(DataType.UUID))
  public messages: string[];

  @Column(DataType.STRING(50))
  public name: string;

  @Default(
    "https://res.cloudinary.com/chatty-app-tdtu/image/upload/v1689778045/dfbwdn094dnhzvbe5ycy.jpg"
  )
  @Column(DataType.STRING)
  public image: string;
}
