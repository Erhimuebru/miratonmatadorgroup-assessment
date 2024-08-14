import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Users } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Users])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Account } from './entities/account.entity';
// // import { Account } from './account.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Account])],
//   providers: [],
//   exports: [TypeOrmModule],  
// })
// export class AccountsModule {}
