import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from './_base.entity';
import { User } from './user.entity';

@Entity()
export class UserDetails extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  hashname: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: false })
  date_birth: Date;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  thumb: string;

  @OneToOne(() => User, (user) => user.details)
  user: User;
}
