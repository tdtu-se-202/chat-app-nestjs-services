import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { TypeOrmBaseEntity } from '../../../commons/abstract-entity/type-orm-base-entity.entity';

@Entity('user')
export class UserEntity extends TypeOrmBaseEntity {
  @Column({ type: 'varchar' })
  public email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string;

  @Column({ type: 'varchar', nullable: true })
  public displayName: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  public address: string | null;

  @Column({ type: 'varchar', nullable: true })
  public phoneNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  public avatarUrl: string | null;

}
