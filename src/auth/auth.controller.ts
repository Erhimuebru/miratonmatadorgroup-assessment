import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}


@Post('register')
async register(@Body() createUserDto: CreateDto) {
  return this.usersService.register(createUserDto);
}

  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    return this.usersService.logine(email, password);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt')) 
  async getMe(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.usersService.getMe(userId);
  }
}
