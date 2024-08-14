// src/transactions/dto/create-transaction.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  accountId: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
