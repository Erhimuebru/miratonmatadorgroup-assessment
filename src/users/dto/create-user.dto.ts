import { IsString, IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { PasswordComplexityValidator } from './password.validator';

export class CreateDto {
  @IsString()
  readonly fullName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phoneNumber: string;

  @IsNotEmpty()
  @Validate(PasswordComplexityValidator)
  password: string;

  @IsString()
  readonly confirmPassword: string;
}
