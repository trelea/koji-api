import { Column, Entity } from 'typeorm';
import { BaseEntity } from './_base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;
}
