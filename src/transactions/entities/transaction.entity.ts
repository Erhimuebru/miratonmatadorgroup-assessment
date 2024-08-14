import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { Users } from 'src/users/entities/user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, account => account.transactions)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Users, user => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'enum', enum: ['debit', 'credit'] })
  type: 'debit' | 'credit';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column()
  description: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'sender_account_id' })
  sender: Account;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'recipient_account_id' })
  recipient: Account;

}
