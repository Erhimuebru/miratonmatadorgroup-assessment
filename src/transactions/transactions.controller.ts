import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post('transfer')
  async transferMoney(
    @Body('senderId') senderId: string,
    @Body('recipientId') recipientId: string,
    @Body('amount') amount: number
  ): Promise<{ message: string }> {
    return this.transactionService.transferMoney(senderId, recipientId, amount);
  }


    @Post(':accountId')
    async createTransaction(
      @Param('accountId') accountId: string,
      @Body() createTransactionDto: CreateTransactionDto
    ): Promise<{ message: string; transaction?: Transaction }> {
  
      if (!accountId) {
        throw new BadRequestException('Account ID is required');
      }  
      try {
        return await this.transactionService.createTransaction(accountId, createTransactionDto);
      } catch (error) {
        if (error.response?.message === 'Account not found') {
          throw new NotFoundException('Account not found');
        }
        if (error.response?.message === 'Insufficient balance') {
          throw new BadRequestException('Insufficient balance');
        }
        if (error.response?.message === 'Invalid transaction type') {
          throw new BadRequestException('Invalid transaction type');
        }
        throw error;
      }
    }
  

    @Get(':accountId')
    async getTransactionsByAccount(@Param('accountId') accountId: string): Promise<any> {
      try {
        const result = await this.transactionService.getTransactionsByAccount(accountId);
        if (result.message) {
          return { message: result.message };
        }
        return result.transactions;
      } catch (error) {
        if (error.response?.message === 'Invalid userId') {
          throw new NotFoundException('Invalid userId');
        }
        throw error;
      }
    }

    
@Get('user/:userId')
async getTransactionsByUser(
  @Param('userId') userId: string
): Promise<{ message: string; transactions: Transaction[] }> {
  try {
    const transactions = await this.transactionService.getTransactionsByUser(userId);
    return { message: 'Transactions retrieved successfully', transactions };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw new NotFoundException('User not found');
    }
    throw error;
  }
}



    @Get(':id')
    async getTransaction(
      @Param('id') id: string
    ): Promise<{ message: string; transaction?: Transaction }> {
      try {
        const transaction = await this.transactionService.getTransactionById(id);
        return { message: 'Transaction retrieved successfully', transaction };
      } catch (error) {
        if (error.response?.message === 'Transaction not found') {
          throw new NotFoundException('Transaction not found');
        }
        throw error;
      }
    }

    
}

