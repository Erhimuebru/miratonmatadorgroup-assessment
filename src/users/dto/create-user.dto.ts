import { IsString, IsEmail, IsNotEmpty, Validate, Length } from 'class-validator';
import { PasswordComplexityValidator } from './password.validator';

export class CreateDto {
  @IsString()
  readonly fullName: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @Length(11, 11, { message: 'Phone number must be exactly 11 digits long' })
  phoneNumber: string;

  @IsNotEmpty()
  @Validate(PasswordComplexityValidator)
  password: string;

  @IsString()
  readonly confirmPassword: string;
}
