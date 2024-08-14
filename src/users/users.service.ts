// user.service.ts
import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { Users } from './entities/user.entity';
import { EmailVerificationService } from 'src/email-verification-service/email-verification-service.service';
import { CreateDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly jwtSecret = process.env.JWT_SECRET;
  private readonly jwtSecretTime = process.env.JWT_SECRET_TIME;


  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly emailService: EmailVerificationService,
  ) {}

  async createUser(userData: Partial<Users>): Promise<Users> {
    try {
      // Check for existing user by email or phone number
      const existingUser = await this.userRepository.findOne({
        where: [{ email: userData.email }, { phoneNumber: userData.phoneNumber }],
      });

      if (existingUser) {
        if (existingUser.email === userData.email) {
          throw new ConflictException('User with the same Email Address already exists');
        }
        if (existingUser.phoneNumber === userData.phoneNumber) {
          throw new ConflictException('User with the same Phone Number already exists');
        }
      }

      // Generate a 6-digit OTP using Math.random()
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpirationTime = new Date();
      otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 10);


      const user = this.userRepository.create({
        ...userData,
        otp,
        otpExpiration: otpExpirationTime,
        isVerified: false,
      });
      const createdUser = await this.userRepository.save(user);

      // Send OTP email
      const otpMessage = `Your verification code is ${otp}. It is valid for 10 minutes.`;
      await this.emailService.sendEmail(user.email, "Account Verification", otpMessage);

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(email: string, otp: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the OTP is correct
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check if the OTP has expired
    const currentTime = new Date();
    if (currentTime > user.otpExpiration) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }
    user.isVerified = true;
    user.otp = null; 
    user.otpExpiration = null; 
    await this.userRepository.save(user);
    return 'User verified successfully';
  }
  
  
  async resendOtp(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Generate a new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpirationTime = new Date();
    newOtpExpirationTime.setMinutes(newOtpExpirationTime.getMinutes() + 10);

    user.otp = newOtp;
    user.otpExpiration = newOtpExpirationTime;
  
    await this.userRepository.save(user);
  
    const otpMessage = `Your new verification code is ${newOtp}. It is valid for 10 minutes.`;
    await this.emailService.sendEmail(user.email, "Account Verification", otpMessage);
  
    return 'A new OTP has been sent to your email.';
  }
  

  async findUserByPhoneNumber(phoneNumber: string): Promise<Users> {
    return this.userRepository.findOne({ where: { phoneNumber } });
  }

  async findUserByEmail(email: string): Promise<Users> {
    return this.userRepository.findOne({ where: { email } });
  }



  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Invalid email');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password: _, ...result } = user;
    return result;
  }


  async login({ email }: { email: string }): Promise<Users> {
    const userExists = await this.findUserByEmail(email);
    if (!userExists) {
      const createUser = this.userRepository.create({ email });
      await this.userRepository.save(createUser);
      return createUser;
    }
    return userExists;
  }


  async findUserById(userId: string): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }


  async register(createUserDto: CreateDto): Promise<{ message: string}> {
    if (!createUserDto.email) {
      throw new BadRequestException('Email is required');
    }

    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }

    if (!createUserDto.confirmPassword) {
      throw new BadRequestException('Confirm Password is required');
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Password and Confirm Password do not match');
    }

    if (!createUserDto.fullName) {
      throw new BadRequestException('Full Name is required');
    }

    if (!createUserDto.phoneNumber) {
      throw new BadRequestException('Phone Number is required');
    }

    const user = await this.createUser(createUserDto);
    const token = this.generateJwtToken(user);

    return {
      message: 'User registered successfully',
    };
  }

  

async logine(email: string, password: string): Promise<{ token: string }> {
  const user = await this.validateUser(email, password);
  if (!user) {
    throw new BadRequestException('Invalid credentials');
  }

  const token = this.generateJwtToken(user);
  // Send login notification email
  await this.emailService.sendLoginNotificationEmail(user.email);

  return { token };
}

generateJwtToken(user: Users): string {
  const payload = { sub: user.id, email: user.email };
  return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtSecretTime });
}

async getMe(userId: string): Promise<Partial<Users>> {
  const user = await this.userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

}
