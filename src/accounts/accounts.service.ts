import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async createAccount(userId: string, accountType: 'personal' | 'business'): Promise<Account> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Input a valid accountId');
    }
    
    const existingAccount = await this.accountRepository.findOne({ where: { user, account_type: accountType } });
    if (existingAccount) {
      throw new ConflictException(`User already has a ${accountType} account`);
    }
  
    const account = this.accountRepository.create({
      user,
      account_type: accountType,
      balance: 0,
    });
  
    try {
      return await this.accountRepository.save(account);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('duplicate key value')) {
        throw new ConflictException('User already have an existing account.');
      }
      throw error;
    }
  }
  

  async getAccountById(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.user) {
      const { password, otp,otpExpiration,isVerified, ...userWithoutPassword } = account.user;
      account.user = userWithoutPassword as Users;
    }

    return account;
  }
  
}
