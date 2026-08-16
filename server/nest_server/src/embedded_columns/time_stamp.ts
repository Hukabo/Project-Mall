import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class TimeStamp {
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;
}
