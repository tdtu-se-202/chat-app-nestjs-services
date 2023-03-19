import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { TypeOrmBaseEntity } from '../../../commons/abstract-entity/type-orm-base-entity.entity';

@Entity('user')
export class UserEntity extends TypeOrmBaseEntity {
  @Column({ name: 'email', type: 'varchar' })
  public email: string;

  @Exclude()
  @Column({ name: 'password', type: 'varchar' })
  public password!: string;

  @Column({ name: 'display_name', type: 'varchar', nullable: true })
  public displayName: string | null;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  public updatedAt!: Date;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  public address: string | null;

  @Column({ name: 'phone_number', type: 'varchar', nullable: true })
  public phoneNumber: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', nullable: true })
  public avatarUrl: string | null;

  @Column({ name: 'access_token', type: 'varchar', nullable: true })
  public accessToken: string | null;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  public refreshToken: string | null;

}
