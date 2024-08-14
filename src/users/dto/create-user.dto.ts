// export class CreateUserDto {}
// create-user.dto.ts
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateDto {
  @IsString()
  readonly fullName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phoneNumber: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly confirmPassword: string;
}
