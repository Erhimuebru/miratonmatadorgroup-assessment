// user.controller.ts
import { Controller, Get, Post, Body, BadRequestException, ConflictException, Logger, Request, UseGuards} from '@nestjs/common';
import { CreateDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Users } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';



@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateDto): Promise<Users> {
    this.logger.log(`Incoming request payload: ${JSON.stringify(createUserDto)}`);
    console.log('Received payload:', createUserDto);
    if (!createUserDto.email) {
      this.logger.error('Email address is missing');
      throw new BadRequestException('Please provide an email address.');
    }

    if (!createUserDto.fullName) {
      this.logger.error('Please Full name is required');
      throw new BadRequestException('Please Full name is required.');
    }

    if (!createUserDto.phoneNumber) {
      this.logger.error('Phone number is missing');
      throw new BadRequestException('Please provide a phone number.');
    }

    if (!createUserDto.password) {
      this.logger.error('Password is missing');
      throw new BadRequestException('Please provide a password.');
    }

    if (!createUserDto.confirmPassword) {
      this.logger.error('Confirm password is missing');
      throw new BadRequestException('Please provide a confirm password.');
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      this.logger.error('Passwords do not match');
      throw new BadRequestException('Passwords do not match.');
    }

    const existingUser = await this.userService.findUserByEmail(createUserDto.email);
    const existingUserPhone = await this.userService.findUserByPhoneNumber(createUserDto.phoneNumber);

    if (existingUser) {
      this.logger.error('User with the same Email Address already exists:', createUserDto.email);
      throw new ConflictException('User with the same Email Address already exists');
    }

    if (existingUserPhone) {
      this.logger.error('User with the same Phone Number already exists:', createUserDto.phoneNumber);
      throw new ConflictException('User with the same Phone Number already exists');
    }

    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async loginUser(@Body() { email, password }: { email: string; password: string }): Promise<Users> {
    this.logger.log(`Incoming request payload: ${JSON.stringify({ email })}`);
    const user = await this.userService.validateUser(email, password);
    return user;
  }

  @Post('otp/validate')
  async verifyUser (@Body('email') email: string, @Body('otp') otp: string): Promise<string> {
    return this.userService.verifyUser(email, otp);
  }

  @Post('resend-otp')
  async  resendOtp(@Body('email') email: string): Promise<string> {
    return this.userService.resendOtp(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req): Promise<Users> {
    const userId = req.user.id;
    return this.userService.findUserById(userId);
  }
}
