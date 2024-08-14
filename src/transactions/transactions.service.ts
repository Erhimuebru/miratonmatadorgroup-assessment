import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}


async createTransaction(accountId: string,createTransactionDto: CreateTransactionDto): Promise<{ message: string; transaction?: Transaction }> {
  const { type, amount, description } = createTransactionDto;
  const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const account = await this.accountRepository.findOne({ where: { id: accountId }, relations: ['user'] });
  if (!account) {
    throw new NotFoundException('Account not found');
  }
  const user = account.user;
  if (!user) {
    throw new NotFoundException('User not found');
  }
  let balance: number = typeof account.balance === 'string' ? parseFloat(account.balance) : account.balance;
  if (isNaN(balance)) {
    throw new BadRequestException('Account balance is not a valid number');
  }
   if (type === 'credit') {
    balance += parsedAmount; 
  } else if (type === 'debit') {
    if (balance < parsedAmount) {
      throw new BadRequestException('Insufficient balance');
    }
    balance -= parsedAmount;  
  } else {
    throw new BadRequestException('Invalid transaction type');
  }

  account.balance = parseFloat(balance.toFixed(2)); 
  await this.accountRepository.save(account);
  const transaction = this.transactionRepository.create({
    type,
    amount: parsedAmount,
    description,
    account,
    user, 
  });
  const savedTransaction = await this.transactionRepository.save(transaction);

  return { message: 'Transaction created successfully', transaction: savedTransaction };
}


  async getTransactionsByAccount(accountId: string): Promise<{ message: string; transactions?: Transaction[] }> {
    const account = await this.accountRepository.findOne({ where: { id: accountId } });
    if (!account) {
      throw new NotFoundException('Invalid userId');
    }

    const transactions = await this.transactionRepository.find({
      where: { account: { id: accountId } },
      relations: ['account'],
    });

    if (transactions.length === 0) {
      return { message: 'No transactions available yet' };
    }

    return { message: '', transactions };
  }


async getTransactionsByUser(userId: string): Promise<Transaction[]> {
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['transactions'],
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user.transactions;
}



  async getTransactionById(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['account'], 
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async transferMoney(senderId: string, recipientId: string, amount: number): Promise<{ message: string }> {
    const senderAccount = await this.accountRepository.findOne({
      where: { id: senderId },
      relations: ['user'] 
    });
    
    if (!senderAccount) {
      console.error('Sender account not found');
      throw new NotFoundException('Sender account not found');
    }
  
    const recipientAccount = await this.accountRepository.findOne({
      where: { id: recipientId },
      relations: ['user'] 
    });
  
    if (!recipientAccount) {
      console.error('Recipient account not found');
      throw new NotFoundException('Recipient account not found');
    }
  
    const senderBalance = Number(senderAccount.balance);
    const recipientBalance = Number(recipientAccount.balance);
  
    if (senderBalance < amount) {
      console.error('Insufficient balance in sender account');
      throw new BadRequestException('Insufficient balance in sender account');
    }
  
    return await this.accountRepository.manager.transaction(async (transactionalEntityManager) => {
      senderAccount.balance = senderBalance - amount;
      await transactionalEntityManager.save(senderAccount);
  
      recipientAccount.balance = recipientBalance + amount;
      await transactionalEntityManager.save(recipientAccount);
  
      const transaction = this.transactionRepository.create({
        sender: senderAccount,
        recipient: recipientAccount,
        amount,
        type: 'debit',
        description: `This account was debited with the sum amount of ${amount}`,
        timestamp: new Date(),
        user: senderAccount.user,
        account: senderAccount,
      });
  
      await transactionalEntityManager.save(transaction);
  
      const recipientTransaction = this.transactionRepository.create({
        sender: recipientAccount,
        recipient: senderAccount,
        amount,
        type: 'credit',
        description: `This account was credited with the sum of ${amount}`,
        timestamp: new Date(),
        user: recipientAccount.user,
        account: recipientAccount,
      });
  
      await transactionalEntityManager.save(recipientTransaction);
  
      return { message: 'Transfer successful' };
    });
  }
  
  
}
