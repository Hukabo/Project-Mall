import { TimeStamp } from '../../../../embedded_columns/time_stamp';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../entity/user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  zonecode!: string;

  @Column()
  roadAddress!: string;

  @Column()
  detailAddress!: string;

  @OneToOne(() => User, (user) => user.address, {
    onDelete: 'SET NULL',
  })
  user!: User;

  @Column(() => TimeStamp)
  timeStamp!: TimeStamp;
}
