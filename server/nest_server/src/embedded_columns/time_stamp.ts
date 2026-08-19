import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class TimeStamp {
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
