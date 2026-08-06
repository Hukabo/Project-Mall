import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class TimeStamp {
  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;
}
