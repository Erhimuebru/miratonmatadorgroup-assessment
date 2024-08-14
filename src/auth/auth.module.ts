import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersService } from './users.service';
import { AuthController } from './auth.controller';
// import { Users } from './entities/user.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { EmailVerificationService } from 'src/email-verification-service/email-verification-service.service';
import { PasswordComplexityValidator } from 'src/users/dto/password.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Account]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [UsersService, EmailVerificationService, JwtStrategy, PasswordComplexityValidator],
})
export class AuthModule {}
