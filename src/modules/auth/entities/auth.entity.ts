import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { TypeOrmBaseEntity } from '../../../commons/abstract-entity/type-orm-base-entity.entity';
import { UserEntity } from '../../users/entities/users.entity';

@Entity('auth')
export class AuthEntity extends TypeOrmBaseEntity {
  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({ type: 'varchar' })
  public accessToken!: string;

  @Column({ type: 'varchar', nullable: true })
  public refreshToken: string | null;
}
