import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Users } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('accounts')
export class Account {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;
  

  @OneToOne(() => Users, user => user.account)
  @JoinColumn()
  user: Users;

  @Column({ type: 'enum', enum: ['personal', 'business'], default: 'personal' })
  account_type: 'personal' | 'business';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];
}
