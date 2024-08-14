import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post(':userId')
  async createAccount(
    @Param('userId') userId: string,
    @Body('accountType') accountType: 'personal' | 'business'
  ): Promise<{ message: string; account?: Account }> {
    try {
      const account = await this.accountsService.createAccount(userId, accountType);
      return { message: 'Account created successfully', account };
    } catch (error) {
      if (error instanceof ConflictException) {
        return { message: error.message };
      }
      throw error;
    }
  }
  


  @Get(':accountId')
async getAccountById(@Param('accountId') accountId: string): Promise<{ message: string; account: Account }> {
  const account = await this.accountsService.getAccountById(accountId);
  return { message: 'Account retrieved successfully', account };
}

  
}
