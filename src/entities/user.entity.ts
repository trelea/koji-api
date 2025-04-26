import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './_base.entity';
import { UserDetails } from './user-details.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
  @JoinColumn()
  details: UserDetails;
}
