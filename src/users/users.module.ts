// import { Module } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';

// @Module({
//   controllers: [UsersController],
//   providers: [UsersService],
// })
// export class UsersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
import { Users } from './entities/user.entity';
import { UsersController } from './users.controller';
import { EmailVerificationService } from 'src/email-verification-service/email-verification-service.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Account]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmailVerificationService,   
  ],
})
export class UsersModule {}
