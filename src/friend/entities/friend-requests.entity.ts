import { 
  Model, Table, Column, 
  PrimaryKey, ForeignKey,
  Default, DataType,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from 'src/user/user.entity';

@Table
export class FriendRequest extends Model {

  @Default(DataType.UUIDV4())
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
    field: 'id'
  })
  public id: string

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({type: DataType.UUID, field: 'user_id'})
  public userId: string;
  
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({type: DataType.UUID, field: 'friend_id'})
  public friendId: string;

  @BelongsTo(() => User, 'userId')
  public fromUser: User;
  
  @BelongsTo(() => User, 'friendId')
  public toUser: User;

  @Column({ type: DataType.STRING, field: 'friend_status'})
  public friendStatus: string;
}